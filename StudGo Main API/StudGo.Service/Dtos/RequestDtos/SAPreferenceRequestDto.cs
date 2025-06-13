using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Data.Entities;

namespace StudGo.Service.Dtos.RequestDtos
{
    public class SAPreferenceRequestDto
    {
        public int CVBio { get; set; }
        public int Location { get; set; }
        public int University { get; set; }
        public int Faculty { get; set; }
    }
}
