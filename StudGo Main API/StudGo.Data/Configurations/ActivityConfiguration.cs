using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudGo.Data.Entities;

namespace StudGo.Data.Configurations
{
    public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
    {
        public void Configure(EntityTypeBuilder<Activity> builder)
        {
            builder.HasOne(a => a.StudentActivity).WithMany(sa => sa.Activities).HasForeignKey(a => a.StudentActivityId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(s => s.Contents).WithOne(c => c.Activity).HasForeignKey(c =>c.ActivityId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
