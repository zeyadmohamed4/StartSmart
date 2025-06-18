using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class TokenService
{
    private readonly string _jwtSecret;
    private readonly int _jwtLifespanMinutes;
    private readonly string _issuer;
    private readonly string _audience;

    public TokenService(IConfiguration configuration)
    {
        _jwtSecret = configuration["JWT:SecretKey"];
        _jwtLifespanMinutes = int.Parse(configuration["JWT:LifespanMinutes"] ?? "10"); // If LifespanMinutes is missing, default to 60 minutes
        _issuer = configuration["JWT:Issuer"];
        _audience = configuration["JWT:Audience"];
    }

    public string GenerateToken(int userId, string username, string role)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,  // Use Issuer from appsettings
            audience: _audience,  // Use Audience from appsettings
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtLifespanMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
