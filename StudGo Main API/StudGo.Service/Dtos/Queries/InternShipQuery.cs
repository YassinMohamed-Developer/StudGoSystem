using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.Queries
{
    public class InternShipQuery
    {
		public string? JobRequirements { get; set; }

		public int? PageIndex { get; set; }

		public int? PageSize { get; set; }

		public string? JobTitle { get; set; }

		public string? Company { get; set; }
	}
}
