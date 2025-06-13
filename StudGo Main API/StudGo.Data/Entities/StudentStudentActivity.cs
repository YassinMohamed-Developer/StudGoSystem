using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace StudGo.Data.Entities
{
    public class StudentStudentActivity
    {
        public int StudentId { get; set; }
        public int StudentActivityId { get; set; }
        public virtual Student Student { get; set; }
        public virtual StudentActivity StudentActivity { get; set; }

        public double? Score { get; set; }
        public string? Details { get; set; }
    }
}
