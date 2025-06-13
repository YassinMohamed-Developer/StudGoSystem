using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.Queries
{
    public class SAQuery
    {
        public int? StudentActivityId { get; set; }

        public string? StudentActivityName { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
        public bool? CanApply { get; set; }
    }
}
