using System.ComponentModel.DataAnnotations;

namespace IdentityService.Api.DTOs;

public record RegisterRequest([Required][EmailAddress] string Email, [Required] string Password);
public record LoginRequest([Required][EmailAddress] string Email, [Required] string Password);
public record AuthResponse(string Token, string Email);
