using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.ResponseDtos
{
    public class StatsDto
    {
        public int ActiveStudents { get; set; }

        public int UpcomingActivities { get; set; }

        public int InternshipOpportunities { get; set; }

        public int TotalActivities { get; set; }

		public int AppliedEvents { get; set; }

        public int AppliedWorkshops { get; set; }

        public int ActiveOrganizations { get; set; }
	}
}
