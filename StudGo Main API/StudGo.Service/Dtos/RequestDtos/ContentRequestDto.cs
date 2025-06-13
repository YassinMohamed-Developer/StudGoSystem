using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Data.Enums;

namespace StudGo.Service.Dtos.RequestDtos
{
    public class ContentRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string HostName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [EnumDataType(typeof(ContentType))]
        public string ContentType { get; set; }
    }
}
