using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    public class StudentActivityPreference
    {
        public int Id { get; set; }
        public int CVBio {  get; set; }
        public int Location { get; set; }
        public int University { get; set; }
        public int Faculty { get; set; }

        public virtual StudentActivity StudentActivity { get; set; }
        public int StudentActivityID { get; set; }
    }
}
