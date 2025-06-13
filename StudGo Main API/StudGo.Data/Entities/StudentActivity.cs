using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    public class StudentActivity
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Biography { get; set; }
        public DateTime? FoundingDate { get; set; }
        public string? PictureUrl { get; set; }
        public string? Address { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public string? University { get; set; }
        public string? Faculty { get; set; }

        public string? JoinFormUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public virtual ICollection<Team> Teams { get; set; } = [];

        public virtual ICollection<Student> Students { get; set; } = [];
        public virtual ICollection<Activity> Activities { get; set; } = [];

        public virtual ICollection<StudentStudentActivity> StudentStudentActivities { get; set; } = [];

        public virtual StudentActivityPreference StudentActivityPreference { get; set; }

        public virtual AppUser AppUser { get; set; }
        public string AppUserId { get; set; }
    }
}
