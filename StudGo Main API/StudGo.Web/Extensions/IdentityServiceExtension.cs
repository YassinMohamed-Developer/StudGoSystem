using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using System.Text;

namespace StudGo.Web.Extensions
{
    public static class IdentityServiceExtension
    {
        public static void AddIdentityService(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddIdentityCore<AppUser>().AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<StudGoDbContext>()
                    .AddSignInManager<SignInManager<AppUser>>()
                    .AddRoleManager<RoleManager<IdentityRole>>()
                    .AddDefaultTokenProviders();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                 .AddJwtBearer(option => {

                     option.TokenValidationParameters = new TokenValidationParameters
                     {
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:Key"])),
                         ValidateIssuer = true,
                         ValidIssuer = configuration["Token:Issuer"],
                         ValidateAudience = false,
                         ValidateLifetime = true,
                     };

                 });
        }
    }
}
