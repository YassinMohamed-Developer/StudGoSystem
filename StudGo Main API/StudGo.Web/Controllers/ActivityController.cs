using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/activity")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivityController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        private string GetUserId() => User.FindFirst("UserId").Value;

        [HttpPost]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> AddActivity([FromBody] ActivityRequestDto input)
        {
            var appUserId = GetUserId();
            var result = await _activityService.AddActivityAsync(input, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            var appUserId = GetUserId();
            var result = await _activityService.DeleteActivityAsync(id, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> UpdateActivity(int id, [FromBody] ActivityRequestDto input)
        {
            var appUserId = GetUserId();
            var result = await _activityService.UpdateActivityAsync(id, input, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(int id)
        {
            var result = await _activityService.GetActivityAsync(id);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/toggle")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> ToggleActivity(int id)
        {
            var appUserId = GetUserId();
            var result = await _activityService.ToggleActivityAsync(id, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("notify")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> NotifyFollowers(EmailMessageDto emailMessageDto)
        {
            var appUserId = GetUserId();
            var result = await _activityService.NotifyFollowersAsync(emailMessageDto, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("{id}/apply")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ApplyForStudentActivity(int id)
        {
            var appUserId = GetUserId();
            var result = await _activityService.ApplyForActivity(id, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("student/my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetActivitiesByStudent()
        {
            var appUserId = GetUserId();
            var result = await _activityService.GetActivitiesByStudentAsync(appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("generate-agenda")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GenerateAgenda(int activityId)
        {
            var appUserId = GetUserId();
            var result = await _activityService.GenerateAgendaAsync(activityId, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{activityId}/delete-agenda")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> DeleteAgenda(int activityId)
        {
            var appUserId = GetUserId();
            var result = await _activityService.DeleteAgendaAsync(activityId, appUserId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetActivities([FromQuery] ActivityQuery activityQuery)
        {
            var result = await _activityService.GetActivitiesAsync(activityQuery);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
        [HttpGet("sa/{id}")]
        public async Task<IActionResult> GetActivitiesBySA(int id)
        {
            var result = await _activityService.GetActivitiesBySAAsync(id);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("student/applied")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> IsStudentAppliedToActivity(int activityId)
        {
            var appUserId = GetUserId();
            var result = await _activityService.IsStudentAppliedToActivity(appUserId, activityId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }


        [HttpGet("students")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GetActivityStudents(int activityId)
        {
            var result = await _activityService.GetStudentsByActivity(activityId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "StudentActivity")]
        [HttpPost("{activityId}/upload-poster")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadPoster(int activityId,IFormFile file)
        {

            var result = await _activityService.UploadPosterAsync(file,activityId,GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }



    }
}
