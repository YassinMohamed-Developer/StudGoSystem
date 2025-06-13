using StudGo.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.ResponseDtos
{
    public class TeamResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string ImageUrl { get; set; }
        public string StudentActivityName{ get; set; }
        public int StudentActivityId { get; set; }
    }
}
