namespace StudGo.Service.Dtos.ResponseDtos
{
    public class StudentActivityStatisticsDto
    {
        public int Id { get; set; }
        
        public int NumOfActivites { get; set; }
        
        public int NumOfEventActivites { get; set; }
        public int NumOfCourseActivites { get; set; }
        public int NumOfWorkshopActivites { get; set; }

        public int NumOfTechnicalActivites { get; set; }
        public int NumOfNonTechnicalActivites { get; set; }
        public int NumOfMixedActivites { get; set; }
        
        public int NumOfTeams { get; set; }
        public int NumOfFollowers { get; set; }
    }
}
