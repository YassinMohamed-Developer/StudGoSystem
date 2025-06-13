using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudGo.Data.Entities;
using StudGo.Service.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudGo.Service.Implementations
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _Key;
        private readonly UserManager<AppUser> _userManager;
        public TokenService(IConfiguration configuration, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _configuration = configuration;
            _Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Token:Key"]));
        }
        public async Task<string> GenerateToken(AppUser appUser,int validFor)
        {
            var roles = await _userManager.GetRolesAsync(appUser);

            var claims = new List<Claim>()
            {
                new Claim("UserId", appUser.Id),
                new Claim("UserName",appUser.UserName),

                

            };
            var id = (appUser.Student?.Id.ToString()) ?? (appUser.StudentActivity?.Id.ToString());
            if (id is not null) claims.Add(new Claim("EntityId", id, ClaimValueTypes.Integer));
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var credential = new SigningCredentials(_Key, SecurityAlgorithms.HmacSha256);

            var TokenDescribe = new SecurityTokenDescriptor
            {
                SigningCredentials = credential,
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddSeconds(validFor),
                Issuer = _configuration["Token:Issuer"],
                IssuedAt = DateTime.Now,
            };

            var tokenhandler = new JwtSecurityTokenHandler();

            var token = tokenhandler.CreateToken(TokenDescribe);

            return tokenhandler.WriteToken(token);
        }
    }
}
