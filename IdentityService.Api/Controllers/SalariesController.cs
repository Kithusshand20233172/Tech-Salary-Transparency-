using IdentityService.Api.Data;
using IdentityService.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace IdentityService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalariesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalariesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var salaries = await _context.SalarySubmissions
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
        return Ok(salaries);
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SalarySubmission submission)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Force status to PENDING regardless of what the user sends
        submission.Status = "PENDING";
        submission.SubmittedAt = DateTime.UtcNow;

        _context.SalarySubmissions.Add(submission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Submitted (PENDING)" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var salary = await _context.SalarySubmissions.FindAsync(id);
        if (salary == null) return NotFound();

        // Calculate votes
        var upvotes = await _context.SalaryVotes.CountAsync(v => v.SalarySubmissionId == id && v.IsUpvote);
        var downvotes = await _context.SalaryVotes.CountAsync(v => v.SalarySubmissionId == id && !v.IsUpvote);

        // Respect anonymity
        var response = new
        {
            salary.Id,
            salary.Country,
            Company = salary.IsAnonymous ? "Anonymous" : salary.Company,
            salary.Role,
            salary.Level,
            salary.ExperienceYears,
            salary.SalaryAmount,
            salary.Currency,
            salary.Period,
            salary.IsAnonymous,
            salary.Status,
            salary.SubmittedAt,
            Upvotes = upvotes,
            Downvotes = downvotes,
            TrustScore = upvotes - downvotes
        };

        return Ok(response);
    }

    [HttpPost("{id}/vote")]
    [Authorize]
    public async Task<IActionResult> Vote(Guid id, [FromBody] VoteRequest request)
    {
        var salary = await _context.SalarySubmissions.FindAsync(id);
        if (salary == null) return NotFound();

        var userEmail = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        // Check if user already voted
        var existingVote = await _context.SalaryVotes
            .FirstOrDefaultAsync(v => v.SalarySubmissionId == id && v.UserEmail == userEmail);

        if (existingVote != null)
        {
            existingVote.IsUpvote = request.IsUpvote;
            existingVote.VotedAt = DateTime.UtcNow;
        }
        else
        {
            _context.SalaryVotes.Add(new SalaryVote
            {
                SalarySubmissionId = id,
                UserEmail = userEmail,
                IsUpvote = request.IsUpvote
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Vote recorded" });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] string? country, [FromQuery] string? role, [FromQuery] string? level)
    {
        var query = _context.SalarySubmissions.Where(s => s.Status == "APPROVED");

        if (!string.IsNullOrEmpty(country)) query = query.Where(s => s.Country == country);
        if (!string.IsNullOrEmpty(role)) query = query.Where(s => s.Role == role);
        if (!string.IsNullOrEmpty(level)) query = query.Where(s => s.Level == level);

        var salaries = await query.Select(s => (double)s.SalaryAmount).ToListAsync();
        if (salaries.Count == 0) return Ok(new { count = 0 });

        salaries.Sort();
        var count = salaries.Count;
        
        var avg = salaries.Average();
        var median = GetPercentile(salaries, 50);
        var p25 = GetPercentile(salaries, 25);
        var p75 = GetPercentile(salaries, 75);

        return Ok(new
        {
            Count = count,
            Average = avg,
            Median = median,
            P25 = p25,
            P75 = p75
        });
    }

    private double GetPercentile(List<double> sortedData, double percentile)
    {
        if (sortedData.Count == 0) return 0;
        if (percentile <= 0) return sortedData[0];
        if (percentile >= 100) return sortedData[^1];

        double position = (sortedData.Count - 1) * (percentile / 100.0);
        int lowerIndex = (int)Math.Floor(position);
        double fraction = position - lowerIndex;

        if (lowerIndex + 1 < sortedData.Count)
        {
            return sortedData[lowerIndex] + (sortedData[lowerIndex + 1] - sortedData[lowerIndex]) * fraction;
        }
        return sortedData[lowerIndex];
    }
    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StatusUpdateRequest request)
    {
        var salary = await _context.SalarySubmissions.FindAsync(id);
        if (salary == null) return NotFound();

        salary.Status = request.Status;
        await _context.SaveChangesAsync();
        
        return Ok(new { message = $"Status updated to {request.Status}" });
    }
}

public class StatusUpdateRequest
{
    public string Status { get; set; } = "APPROVED"; // APPROVED, REJECTED, PENDING
}

public class VoteRequest
{
    public bool IsUpvote { get; set; }
}
