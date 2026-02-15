using IdentityService.Api.Data;
using IdentityService.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5001");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "KITHU Salary Service", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity Services
builder.Services.AddScoped<IAuthService, AuthService>();

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Method for manual DI in services if needed, but not used here.

var app = builder.Build();

// Configure the HTTP request pipeline.
// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

// CORS for Next.js (must specify origin when using credentials)
app.UseCors(x => x
    .WithOrigins("http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());  // Required for httpOnly cookies

app.UseAuthentication();
app.UseAuthorization();

// Ensure DB is created (Migration alternative for MVP)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Wait for DB to be ready in Docker
    try 
    {
        // For shared DB in MVP, EnsureCreated only works if the DB is empty.
        // We manually ensure ALL specific tables exist to avoid partial init issues.
        var sql = @"
            CREATE TABLE IF NOT EXISTS ""Users"" (
                ""Id"" uuid NOT NULL CONSTRAINT ""PK_Users"" PRIMARY KEY,
                ""Email"" text NOT NULL,
                ""PasswordHash"" text NOT NULL,
                ""Username"" text,
                ""CreatedAt"" timestamp with time zone NOT NULL
            );

            -- Ensure Username is NULLABLE 
            ALTER TABLE ""Users"" ALTER COLUMN ""Username"" DROP NOT NULL;

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Users_Email"" ON ""Users"" (""Email"");

            CREATE TABLE IF NOT EXISTS ""SalarySubmissions"" (
                ""Id"" uuid NOT NULL CONSTRAINT ""PK_SalarySubmissions"" PRIMARY KEY,
                ""Country"" text NOT NULL,
                ""Company"" text NOT NULL,
                ""Role"" text NOT NULL,
                ""ExperienceYears"" integer NOT NULL,
                ""Level"" text NOT NULL,
                ""SalaryAmount"" numeric NOT NULL,
                ""Currency"" text NOT NULL,
                ""Period"" text NOT NULL,
                ""IsAnonymous"" boolean NOT NULL,
                ""Status"" text NOT NULL,
                ""UserEmail"" text,
                ""SubmittedAt"" timestamp with time zone NOT NULL
            );";
            
        dbContext.Database.ExecuteSqlRaw(sql);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"DB Initialization failed: {ex.Message}");
    }
}

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("\n----------------------------------------------------------------");
    Console.WriteLine("   🚀 KITHU Salary Service is running!");
    Console.WriteLine("   📄 Swagger UI: http://localhost:5001/swagger");
    Console.WriteLine("----------------------------------------------------------------\n");
});

app.Run();
