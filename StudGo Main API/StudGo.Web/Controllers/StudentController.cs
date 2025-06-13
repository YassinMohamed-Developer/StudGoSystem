using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Implementations;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/student")]
    [ApiController]
    
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        private string GetUserId() => User.FindFirst("UserId").Value;

        [Authorize(Roles = "Student")]
        [HttpPost("update-profile")]
        public async Task<IActionResult> UpsertStudent([FromBody] StudentRequestDto input)
        {
            var result = await _studentService.UpsertStudent(input, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var result = await _studentService.GetProfile(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Student")]
        [HttpPost("upload-cv")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadCv(IFormFile cv)
        {
            var result = await _studentService.UploadCv(cv, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Student")]
        [HttpPost("upload-picture")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile picture)
        {
            var result = await _studentService.UploadProfilePicture(picture, GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Student")]
        [HttpDelete("delete-picture")]
        public async Task<IActionResult> DeleteProfilePicture()
        {
            var result = await _studentService.DeleteProfilePicture(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
        [Authorize(Roles= "Student")]
        [HttpDelete("delete-cv")]
        public async Task<IActionResult> DeleteCv()
        {
            var result = await _studentService.DeleteCv(GetUserId());
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
    }
}
