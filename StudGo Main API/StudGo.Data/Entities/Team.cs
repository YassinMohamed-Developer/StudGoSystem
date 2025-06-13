using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string? ImageUrl { get; set; }
        public virtual StudentActivity StudentActivity { get; set; }
        public int StudentActivityId { get; set; }

    }
}
