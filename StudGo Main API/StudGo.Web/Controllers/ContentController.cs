using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/content")]
    [ApiController]
    public class ContentController : ControllerBase
    {
		private readonly IContentService _contentService;

		public ContentController(IContentService contentService)
		{
			_contentService = contentService;
		}

		[HttpPost("{activityId}")]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> AddContentAsync(int activityId,[FromBody]ContentRequestDto input)
		{
			var AppUserId = User.FindFirst("UserId").Value;

			var result = await _contentService.AddContentAsync(input, activityId, AppUserId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
		[HttpPut("{contentId}")]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> UpdateContentAsync(int contentId,[FromBody]ContentRequestDto input)
		{
			var AppUserId = User.FindFirst("UserId").Value;

			var result = await _contentService.UpdateContentAsync(input, contentId, AppUserId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
		[HttpDelete("{contentId}")]
		[Authorize(Roles = "StudentActivity")]
		public async Task<ActionResult<BaseResult<string>>> DeleteContentAsync(int contentId)
		{
			var AppUserId = User.FindFirst("UserId").Value;

			var result = await _contentService.DeleteContentAsync(contentId, AppUserId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<BaseResult<ContentResponseDto>>> GetContentAsync(int id)
		{
			var result = await _contentService.GetContentAsync(id);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpGet("activity/{activityId}")]

		public async Task<ActionResult<BaseResult<IReadOnlyList<ContentResponseDto>>>> GetActivityContents(int activityId)
		{
			var result = await _contentService.GetActivityContents(activityId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

	}
}
