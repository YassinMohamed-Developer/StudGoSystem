using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.Queries
{
    public class ActivityQuery
    {
        public string? Name { get; set; }
        public int? StudentActivityId { get; set; }

        public string? StudentActivityName { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
        public string? ActivityType { get; set; }
        public string? ActivityCategory { get; set; }

        public bool? IsSortedByStartDate { get; set; }
        public bool? IsDescending { get; set; }
    }
}
