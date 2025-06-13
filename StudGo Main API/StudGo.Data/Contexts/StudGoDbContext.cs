using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudGo.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Contexts
{
    public class StudGoDbContext : IdentityDbContext<AppUser>
    {
        public StudGoDbContext(DbContextOptions<StudGoDbContext> options) : base(options)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentActivity> StudentActivities { get; set; }
        public DbSet<Activity> Activities { get; set; }

        public DbSet<Content> Contents { get; set; }

        public DbSet<Team> Teams { get; set; }

        public DbSet<InternShip> InternShips { get; set; }

        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<StudentChat> StudentChats { get; set; }

        public DbSet<StudentActivityPreference> StudentActivityPreferences { get; set; }

    }
}
