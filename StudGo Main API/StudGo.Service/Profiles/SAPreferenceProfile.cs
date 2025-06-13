using AutoMapper;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;

namespace StudGo.Service.Profiles
{
    public class SAPreferenceProfile : Profile
    {
        public SAPreferenceProfile()
        {
            CreateMap<StudentActivityPreference, SAPreferenceResponseDto>();
            CreateMap<SAPreferenceRequestDto, StudentActivityPreference>();
        }
    }
}
