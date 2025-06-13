using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace StudGo.Data.Entities
{
    public class StudentChat
    {
        public int Id { get; set; }
        public int StudentId { get; set; }

        public string? LastMessage { get; set; }

        public string? LastResponse { get; set; }

        public string? ContextSummary { get; set; }

        public bool IsImportant { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Student Student { get; set; }
    }
}
