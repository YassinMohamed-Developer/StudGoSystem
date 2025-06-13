using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudGo.Data.Contexts;
using StudGo.Data.Seeding;

namespace StudGo.Web.Helpers
{
    public class ApplySeeding
    {
        public static async Task ApplySeedingAsync(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {

                    var context = services.GetRequiredService<StudGoDbContext>();
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                    await context.Database.MigrateAsync();

                    await StudGoIdentityContextSeed.SeedRoleAsync(roleManager);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

            }
        }
    }
}
