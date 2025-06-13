using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudGo.Data.Entities;

namespace StudGo.Data.Configurations
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.HasOne(s => s.AppUser).WithOne(s=>s.Student).HasForeignKey<Student>(s => s.AppUserId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
