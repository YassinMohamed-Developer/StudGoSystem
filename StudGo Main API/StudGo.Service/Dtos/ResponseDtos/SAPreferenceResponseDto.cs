using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Data.Entities;

namespace StudGo.Service.Dtos.ResponseDtos
{
    public class SAPreferenceResponseDto
    {
        public int Id { get; set; }
        public int CVBio { get; set; }
        public int Location { get; set; }
        public int University { get; set; }
        public int Faculty { get; set; }
        public int StudentActivityID { get; set; }
    }
}
