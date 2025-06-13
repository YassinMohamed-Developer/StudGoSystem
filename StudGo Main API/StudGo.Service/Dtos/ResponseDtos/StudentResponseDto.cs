using StudGo.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.ResponseDtos
{
    public class StudentResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string? PictureUrl { get; set; }
        public string FieldOfStudy { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string? CvUrl { get; set; }
        public string University { get; set; }
        public string Faculty { get; set; }
    }
}
