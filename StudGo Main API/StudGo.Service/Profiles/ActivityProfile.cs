using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using StudGo.Data.Entities;
using StudGo.Data.Enums;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;

namespace StudGo.Service.Profiles
{
    public class ActivityProfile : Profile
    {
        public ActivityProfile()
        {
            CreateMap<ActivityRequestDto, Activity>();
            CreateMap<Activity, ActivityResponseDto>()
                .ForMember(dest => dest.StudentActivityName,options => options.MapFrom(src => src.StudentActivity.Name) )
                .ForMember(dest => dest.AgendaUrl,options => options.MapFrom<ActivityAgendaUrlResolver>())
                .ForMember(dest => dest.PosterUrl,options => options.MapFrom<ActivityPosterUrlResolver>());

        }

        
    }
    public class ActivityAgendaUrlResolver : IValueResolver<Activity, ActivityResponseDto, string>
    {
        private readonly IConfiguration _configuration;
        public ActivityAgendaUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(Activity source, ActivityResponseDto destination, string destMember, ResolutionContext context)
        {
            if(source.AgendaUrl is not null) return _configuration["BaseUrl"] +"/"+ source.AgendaUrl;
            return null;
        }
    }

    public class ActivityPosterUrlResolver : IValueResolver<Activity, ActivityResponseDto, string>
    {
        private readonly IConfiguration _configuration;
        public ActivityPosterUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Resolve(Activity source, ActivityResponseDto destination, string destMember, ResolutionContext context)
        {
            if (source.PosterUrl is not null) return _configuration["BaseUrl"] + "/" + source.PosterUrl;
            return null;
        }
    }
}
