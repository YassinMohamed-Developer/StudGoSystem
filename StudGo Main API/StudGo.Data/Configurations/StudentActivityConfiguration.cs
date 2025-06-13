using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudGo.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Configurations
{
    public class StudentActivityConfiguration : IEntityTypeConfiguration<StudentActivity>
    {
        public void Configure(EntityTypeBuilder<StudentActivity> builder)
        {
                builder.HasOne(s => s.AppUser).WithOne(s => s.StudentActivity).HasForeignKey<StudentActivity>(s => s.AppUserId).OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(sa => sa.Students).WithMany(s => s.StudentActivities).UsingEntity<StudentStudentActivity>(
                l => l.HasOne<Student>(ss => ss.Student).WithMany(s => s.StudentStudentActivities),
                r => r.HasOne<StudentActivity>(ss => ss.StudentActivity).WithMany(sa => sa.StudentStudentActivities));
        }
    }
}
