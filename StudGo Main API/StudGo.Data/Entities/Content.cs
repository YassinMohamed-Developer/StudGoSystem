using StudGo.Data.Enums;

namespace StudGo.Data.Entities
{
    public class Content
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string HostName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public virtual Activity Activity { get; set; }
        public int? ActivityId { get; set; }

        public ContentType ContentType { get; set; }
    }
}
