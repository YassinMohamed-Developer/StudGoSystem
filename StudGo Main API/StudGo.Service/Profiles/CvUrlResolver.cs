using AutoMapper;
using Microsoft.Extensions.Configuration;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.ResponseDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Profiles
{
	public class CvUrlResolver : IValueResolver<Student, StudentResponseDto, string>
	{
		private readonly IConfiguration _configuration;

		public CvUrlResolver(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public string Resolve(Student source, StudentResponseDto destination, string destMember, ResolutionContext context)
		{
			if (!string.IsNullOrEmpty(source.CvUrl))
			{
				return $"{_configuration["BaseUrl"]}/{source.CvUrl}";
			}
			return "CV have Issue";
		}
	}
}
