using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/sa")]
    [ApiController]

    public class StudentActivityController : ControllerBase
    {
        private readonly IStudentActivityService _studentActivityService;

        public StudentActivityController(IStudentActivityService studentActivityService)
        {
            _studentActivityService = studentActivityService;
        }

        private string GetUserId() => User?.FindFirst("UserId").Value;

        [HttpPost("update-profile")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> UpsertStudentActivity([FromBody] StudentActivityRequestDto input)
        {
            var result = await _studentActivityService.UpsertStudentActivityAsync(input, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("profile")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GetProfile()
        {
            var result = await _studentActivityService.GetProfileAsync(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("statistics")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GetStatistics()
        {
            var result = await _studentActivityService.GetStudentActivityStatisticsAsync(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("upload-picture")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> UploadPicture(IFormFile picture)
        {


            var result = await _studentActivityService.UploadProfilePictureAsync(picture, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("{id}/toggle-follow")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> FollowUnFollowStudentActivity(int id)
        {
            var result = await _studentActivityService.ToggleFollowingStudentActivityAsync(id, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentActivityById(int id)
        {
            var result = await _studentActivityService.GetStudentActivityByIdAsync(id);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
        [HttpGet("filter")]
        public async Task<IActionResult> GetStudentActivities([FromQuery] SAQuery query)
        {
            var result = await _studentActivityService.GetStudentActivitiesAsync(query);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("followers")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GetFollowers()
        {
            var result = await _studentActivityService.GetFollowers(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{studentActivityId}/is-following")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> IsFollowingStudentActivity(int studentActivityId)
        {
            var result = await _studentActivityService.IsFollowingSA(GetUserId(), studentActivityId);
            return result.IsSuccess ? Ok(result) : BadRequest(result);

        }

        [HttpGet("student/followed-sa")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetFollowedStudentActivities()
        {
            var result = await _studentActivityService.SAFollowedByStudent(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("preferences")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> UpdatePreferences(SAPreferenceRequestDto input)
        {
            var result = await _studentActivityService.UpdateMyPreference(input, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpGet("preferences")]
        [Authorize(Roles = "StudentActivity")]
        public async Task<IActionResult> GetPreferences()
        {
            var result = await _studentActivityService.GetMyPreference(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }


    }
}
