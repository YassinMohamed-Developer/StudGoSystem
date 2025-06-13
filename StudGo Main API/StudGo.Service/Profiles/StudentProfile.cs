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
    public class StudentProfile : Profile
    {
        public StudentProfile()
        {
            CreateMap<Student, StudentResponseDto>()
                .ForMember(dest => dest.PictureUrl, option => option.MapFrom<ProfilePictureUrlResolver>())
                .ForMember(dest => dest.CvUrl, option => option.MapFrom<CvUrlResolver>());

            CreateMap<StudentRequestDto, Student>();
        }
    }
}
