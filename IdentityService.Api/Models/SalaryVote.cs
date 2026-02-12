using System.ComponentModel.DataAnnotations;

namespace IdentityService.Api.Models;

public class SalaryVote
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid SalarySubmissionId { get; set; }

    [Required]
    public string UserEmail { get; set; } = string.Empty;

    public bool IsUpvote { get; set; }

    public DateTime VotedAt { get; set; } = DateTime.UtcNow;
}
