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
    public class ContentProfile : Profile
    {
		public ContentProfile()
		{
			CreateMap<ContentRequestDto, Content>();
			CreateMap<Content, ContentResponseDto>();
		}
	}
}
