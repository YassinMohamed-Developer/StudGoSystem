using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.RequestDtos
{
    public class WorkshopRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool OpenForApplication { get; set; }
        public int NumberofSeats { get; set; }
    }
}
