using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Data.Entities
{
    public class ChatHistory
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public string MessageType { get; set; }  // 'user' or 'assistant'

        public string MessageContent { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public bool IsImportant { get; set; }

        // Navigation property
        public virtual Student Student { get; set; }
    }
}
