using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Seeding
{
    public class StudGoIdentityContextSeed
    {
        public static async Task SeedRoleAsync(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                List<IdentityRole> roles = [new IdentityRole { Name = "Student" }, new IdentityRole { Name = "StudentActivity" }];
                {
                }
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }

            }

        }
    }
}

