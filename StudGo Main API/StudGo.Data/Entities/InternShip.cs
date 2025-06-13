using StudGo.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    public class InternShip
    {
        public int Id { get; set; }
		public string? JobTitle { get; set; }

        public string? JobDescription { get; set; }

		public string? Company {  get; set; }

        public string? Address { get; set; }

        public string? JobType { get; set; }
        public string? Country { get; set; }

        public string? Workplace { get; set; }
        public string? Category { get; set; }

        public string? JobRequirements { get; set; }

        public string? CareerLevel { get; set; }

        public string? JobUrl { get; set; }

        public string? YearsOfExperience { get; set; }

	}
}
