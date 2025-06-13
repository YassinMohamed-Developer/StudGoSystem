using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities.IO;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Helpers.Settings;
using StudGo.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Implementations
{
	public class TeamService : ITeamService
	{
		private readonly StudGoDbContext _dbContext;
		private readonly IMapper _mapper;

		public TeamService(StudGoDbContext dbContext,IMapper mapper)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}
		public async Task<BaseResult<string>> AddTeamAsync(TeamRequestDto input, string appUserId)
		{
			var StudentActivity = await _dbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

			if(StudentActivity is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}

			var MapTeam = _mapper.Map<Team>(input);

			MapTeam.StudentActivityId = StudentActivity.Id;
			await _dbContext.Teams.AddAsync(MapTeam);
			await _dbContext.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<string>> DeleteTeamAsync(int teamId, string appUserId)
		{
			var StudentActivity = await _dbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

			if (StudentActivity is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}

			var Team = await _dbContext.Teams.FirstOrDefaultAsync(T => T.Id == teamId && T.StudentActivityId == StudentActivity.Id);

			if(Team is null)
			{
				return BaseResult<string>.Failure(errors: ["Team Not Found to Delete it"]);
			}

			_dbContext.Teams.Remove(Team);
			await _dbContext.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<IReadOnlyList<TeamResponseDto>>> GetStudentActivitiyTeamsAsync(int StudentActivityId)
		{
			var StudentActvity = await _dbContext.StudentActivities.FirstOrDefaultAsync(S => S.Id == StudentActivityId);

			if (StudentActvity is null)
			{
				return BaseResult<IReadOnlyList<TeamResponseDto>>.Failure(errors: ["Profile is not completed"]);
			}

			var Teams = StudentActvity.Teams;

			var MapTeam = _mapper.Map<IReadOnlyList<TeamResponseDto>>(Teams);

			return BaseResult<IReadOnlyList<TeamResponseDto>>.Success(data: MapTeam);
		}

		public async Task<BaseResult<TeamResponseDto>> GetTeamAsync(int teamId)
		{
			var Team = await _dbContext.Teams.FirstOrDefaultAsync(T => T.Id == teamId);

			if (Team is null)
			{
				return BaseResult<TeamResponseDto>.Failure(errors: ["Team is Not Found"]);
			}

			var MapTeam = _mapper.Map<TeamResponseDto>(Team);

			return BaseResult<TeamResponseDto>.Success(data: MapTeam);
		}

		public async Task<BaseResult<string>> UpdateTeamAsync(TeamRequestDto input, int teamId, string appUserId)
		{
			var StudentActivity = await _dbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

			if (StudentActivity is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}

			var Team = await _dbContext.Teams.FirstOrDefaultAsync(T => T.Id == teamId && T.StudentActivityId == StudentActivity.Id);

			if (Team is null)
			{
				return BaseResult<string>.Failure(errors: ["Team Not Found to Update it"]);
			}

			var TeamMap = _mapper.Map(input, Team);
			await _dbContext.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		//public async Task<BaseResult<string>> UploadImageAsync(IFormFile file, int teamId, string appUserId)
		//{
		//	var StudentActivity = await _dbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

		//	if (StudentActivity is null)
		//	{
		//		return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
		//	}

		//	var Team = await _dbContext.Teams.FirstOrDefaultAsync(T => T.Id == teamId && T.StudentActivityId == StudentActivity.Id);

		//	if(Team is null)
		//	{
		//		return BaseResult<string>.Failure(errors: ["This Team Is Not Found"]);
		//	}

		//	try
		//	{
		//		var filename = DocumentSettings.UploadFile(file, "Teams/Pictures");

		//		if (string.IsNullOrEmpty(filename))
		//		{
		//			return BaseResult<string>.Failure(errors: ["Picture Not Saved Correctly"]);
		//		}


		//		Team.ImageUrl = filename;
		//		await _dbContext.SaveChangesAsync();

				
		//		return BaseResult<string>.Success();
				
		//	}
		//	catch (Exception ex)
		//	{
		//		return BaseResult<string>.Failure(errors: [ex.Message]);
		//	}

		//}
	}
}
