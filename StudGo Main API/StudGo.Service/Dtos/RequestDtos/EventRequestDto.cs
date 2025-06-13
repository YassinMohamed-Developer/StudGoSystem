namespace StudGo.Service.Dtos.ResponseDtos
{
    public class EventRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Governorate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Address { get; set; }
        public int NumberOfSeats { get; set; }
        public bool OpenForApplication { get; set; }


    }
}
