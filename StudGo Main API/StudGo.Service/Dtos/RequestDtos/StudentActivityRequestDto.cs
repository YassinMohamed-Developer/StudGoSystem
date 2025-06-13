using StudGo.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.RequestDtos
{
    public class StudentActivityRequestDto
    {
        public string Name { get; set; }
        public string Biography { get; set; }
        public DateTime FoundingDate { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string? JoinFormUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string University { get; set; }
        public string Faculty { get; set; }

    }
}
