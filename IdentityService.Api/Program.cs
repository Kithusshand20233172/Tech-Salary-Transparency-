using IdentityService.Api.Data;
using IdentityService.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "KITHU Identity Service", Version = "v1" });
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
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"]
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
        var sql = @"
            CREATE TABLE IF NOT EXISTS ""Users"" (
                ""Id"" uuid NOT NULL CONSTRAINT ""PK_Users"" PRIMARY KEY,
                ""Email"" text NOT NULL,
                ""PasswordHash"" text NOT NULL,
                ""Username"" text,
                ""CreatedAt"" timestamp with time zone NOT NULL
            );
            
            -- Ensure Username is NULLABLE if it exists but has a constraint
            ALTER TABLE ""Users"" ALTER COLUMN ""Username"" DROP NOT NULL;

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Users_Email"" ON ""Users"" (""Email"");

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Users_Email"" ON ""Users"" (""Email"");

            CREATE TABLE IF NOT EXISTS ""RefreshTokens"" (
                ""Id"" uuid NOT NULL CONSTRAINT ""PK_RefreshTokens"" PRIMARY KEY,
                ""Token"" text NOT NULL,
                ""UserId"" uuid NOT NULL,
                ""ExpiresAt"" timestamp with time zone NOT NULL,
                ""CreatedAt"" timestamp with time zone NOT NULL,
                ""RevokedAt"" timestamp with time zone
            );
            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_RefreshTokens_Token"" ON ""RefreshTokens"" (""Token"");
            CREATE INDEX IF NOT EXISTS ""IX_RefreshTokens_UserId"" ON ""RefreshTokens"" (""UserId"");";
        
        dbContext.Database.ExecuteSqlRaw(sql);
    }
    catch (Exception ex)
    {
        // Log error or just retry manually
        Console.WriteLine($"DB Connection failed: {ex.Message}");
    }
}

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("\n----------------------------------------------------------------");
    Console.WriteLine("   🚀 KITHU Identity Service is running!");
    Console.WriteLine("   📄 Swagger UI: http://localhost:5000/swagger");
    Console.WriteLine("----------------------------------------------------------------\n");
});

app.Run();
