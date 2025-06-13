using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Data.Enums;

namespace StudGo.Data.Entities
{
    public class Activity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public string? PosterUrl { get; set; }
        //public string? ImageUrl { get; set; }
        public string? AgendaUrl { get; set; }
        public bool IsOpened { get; set; }
        public int NumberOfSeats { get; set; }
        public ActivityType ActivityType { get; set; }
        public ActivityCategory ActivityCategory { get; set; }
        public virtual StudentActivity StudentActivity { get; set; }
        public int? StudentActivityId { get; set; }
        public virtual ICollection<Student> Students { get; set; } = [];
        public virtual ICollection<Content > Contents { get; set; } = [];





    }
}
