using AutoMapper;
using Microsoft.Extensions.Configuration;
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
    public class StudentActivityProfile : Profile
    {
        public StudentActivityProfile()
        {
            CreateMap<StudentActivityRequestDto, StudentActivity>();
            CreateMap<StudentActivity, StudentActivityResponseDto>()
                .ForMember(dest => dest.PictureUrl,options => options.MapFrom<SAPictureUrlResolver>());
        }
    }

    public class SAPictureUrlResolver : IValueResolver<StudentActivity, StudentActivityResponseDto, string>
    {
        private readonly IConfiguration _configuration;
        public SAPictureUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(StudentActivity source, StudentActivityResponseDto destination, string destMember, ResolutionContext context)
        {
            if (source.PictureUrl is not null) return _configuration["BaseUrl"] + "/" + source.PictureUrl;
            return null;
        }
    }
}
