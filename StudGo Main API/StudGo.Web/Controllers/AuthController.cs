using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StudGo.Data.Entities;
using StudGo.Data.Enums;
using StudGo.Service.Dtos.AuthDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;

namespace StudM.Web.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;


        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("student-Register")]
        public async Task<ActionResult<BaseResult<TokenDto>>> StudentRegister(RegisterDto input)
        {
            var result = await _authService.RegisterAsync(input,"Student");
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("sa-register")]
        public async Task<ActionResult<TokenDto>> StudentActivityRegister(RegisterDto input)
        {
            var result = await _authService.RegisterAsync(input, "StudentActivity");
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDto>> Login(LoginDto input)
        {
            var result = await _authService.LoginAsync(input);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<BaseResult<string>>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var result = await _authService.ForgotPassword(forgotPasswordDto);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("reset-password")]
		public async Task<ActionResult<BaseResult<string>>> ResetPassword(ResetPasswordDto resetPasswordDto)
		{
			var result = await _authService.ResetPassword(resetPasswordDto);

			return result.IsSuccess?Ok(result) : BadRequest(result);

        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> Google(GoogleTokenDto token)
        {
            var result = await _authService.GoogleLoginAsync(token.Token,token.IsStudentActivity);
            return result.IsSuccess ? Ok(result) : BadRequest(result);

        }
    }
}
