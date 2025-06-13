using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Data.Entities;
using StudGo.Data.Enums;

namespace StudGo.Service.Dtos.RequestDtos
{
    public class ActivityRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public int NumberOfSeats { get; set; }
        [EnumDataType(typeof(ActivityType))]
        public string ActivityType { get; set; }

        [EnumDataType(typeof(ActivityCategory))]
        public string ActivityCategory { get; set; }
    }
}
