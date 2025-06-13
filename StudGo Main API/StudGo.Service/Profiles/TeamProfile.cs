using AutoMapper;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Profiles
{
    public class TeamProfile :Profile
    {
        public TeamProfile()
        {
            CreateMap<TeamRequestDto, Team>();
            CreateMap<Team, TeamResponseDto>()
                .ForMember(dest => dest.StudentActivityName, options => options.MapFrom(src => src.StudentActivity.Name));
            CreateMap<TeamResponseDto, Team>();
        }
    }
}
