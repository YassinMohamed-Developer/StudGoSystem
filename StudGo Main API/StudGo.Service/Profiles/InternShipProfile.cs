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
    public class InternShipProfile : Profile
    {
		public InternShipProfile()
		{
			CreateMap<InternShipRequestDto, InternShip>();
			CreateMap<InternShip, InternShipResponseDto>();
		}
	}
}
