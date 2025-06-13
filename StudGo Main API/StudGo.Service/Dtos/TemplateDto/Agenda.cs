using StudGo.Data.Entities;

namespace StudGo.Service.Dtos.TemplateDto
{
    public class Agenda
    {
        public Activity Activity { get; set; }
        public List<Content> Contents { get; set; }
    }
}
