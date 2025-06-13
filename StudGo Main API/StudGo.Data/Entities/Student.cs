using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    
    public class Student
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string? PictureUrl { get; set; }
        public string? FieldOfStudy { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? CvUrl { get; set; }
        public string? University { get; set; }
        public string? Faculty { get; set; }
        public virtual ICollection<StudentActivity> StudentActivities { get; set; } = [];

        public virtual ICollection<StudentStudentActivity> StudentStudentActivities { get; set; } = [];

        public virtual ICollection<Activity> Activities { get; set; }
        public virtual AppUser AppUser { get; set; }
        public string AppUserId { get; set; }

        public virtual StudentChat StudentChat { get; set; }
        public virtual ICollection<ChatHistory> ChatHistories { get; set; } = [];

    }
}
