using System.ComponentModel.DataAnnotations;

namespace IdentityService.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Username { get; set; }  // Optional, using Email as primary identifier
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
