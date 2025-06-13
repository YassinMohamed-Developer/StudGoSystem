using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
	[Route("api/team")]
	[ApiController]
	public class TeamController : ControllerBase
	{
		private readonly ITeamService _teamService;

		public TeamController(ITeamService teamService)
		{
			_teamService = teamService;
		}

		[HttpPost]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> AddTeamAsync([FromBody] TeamRequestDto input)
		{
			var appuserid = User.FindFirst("UserId").Value;

			var result = await _teamService.AddTeamAsync(input, appuserid);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
		[HttpPut("{teamId}")]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> UpdateTeamAsync(int teamId, [FromBody] TeamRequestDto input)
		{
			var appuserid = User.FindFirst("UserId").Value;

			var result = await _teamService.UpdateTeamAsync(input, teamId, appuserid);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
		//[HttpPut("{teamId}/upload-image")]
		//[Authorize(Roles = "StudentActivity")]
		//public async Task<ActionResult<BaseResult<string>>> UploadImageAsync(int teamId, IFormFile file)
		//{
		//	var appuserid = User.FindFirst("UserId").Value;

		//	var result = await _teamService.UploadImageAsync(file, teamId, appuserid);

		//	if (!result.IsSuccess)
		//	{
		//		return BadRequest(result);
		//	}
		//	return Ok(result);
		//}

		[HttpDelete("{teamId}")]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> DeleteTeamAsync(int teamId)
		{
			var appuserid = User.FindFirst("UserId").Value;

			var result = await _teamService.DeleteTeamAsync(teamId, appuserid);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}

		[HttpGet("{teamid}")]
		public async Task<ActionResult<BaseResult<TeamResponseDto>>> GetTeamAsync(int teamid)
		{
			var result = await _teamService.GetTeamAsync(teamid);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}

		[HttpGet("sa/{Studentactivityid}")]
		public async Task<ActionResult<BaseResult<IReadOnlyList<TeamResponseDto>>>> GetStudentActivitiyTeamsAsync(int Studentactivityid)
		{
			var result = await _teamService.GetStudentActivitiyTeamsAsync(Studentactivityid);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
	}
}
