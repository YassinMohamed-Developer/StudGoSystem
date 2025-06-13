using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.AuthDtos;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace StudGo.Service.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
		private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
			_emailService = emailService;
		}


		public async Task<BaseResult<TokenDto>> LoginAsync(LoginDto input)
        {
            var validFor = 24 * 60 * 60;
            var user = await _userManager.FindByEmailAsync(input.Email);
            if (user is null)
            {
                throw new CustomException($"Email is not exist.") { StatusCode=(int)HttpStatusCode.BadRequest};
            }
            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, input.Password, false);
            if (!signInResult.Succeeded)
            {
                throw new CustomException($"Invalid credentials for '{input.Email}'.") { StatusCode = (int)HttpStatusCode.BadRequest };
            }
            var token = new TokenDto
            {
                TokenType = "bearer",
                ExpiresIn = validFor,
                AccessToken = await _tokenService.GenerateToken(user, validFor)
            };
            return new BaseResult<TokenDto> { Data=token,Message="User logged in successfully."};

        }

        public async Task<BaseResult<string>> RegisterAsync(RegisterDto input, string accountType)
        {
            var result = new BaseResult<TokenDto>();

            var user = await _userManager.FindByEmailAsync(input.Email);
            if (user is not null) {
                throw new CustomException($"Email '{input.Email} is already used.'") { StatusCode = (int)HttpStatusCode.BadRequest };
                    }
            user = await _userManager.FindByNameAsync(input.UserName);
            if (user is not null)
            {
                throw new CustomException($"Username '{input.UserName} is already used.'") { StatusCode = (int)HttpStatusCode.BadRequest };
            }
            var newUser = new AppUser
            {
                Email = input.Email,
                UserName = input.UserName

            };
            if (accountType == "Student") newUser.Student = new Student();
            if(accountType == "StudentActivity") newUser.StudentActivity = new StudentActivity() {StudentActivityPreference = new() };
            var userResult = await _userManager.CreateAsync(newUser, input.Password);
            if (userResult.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(newUser, accountType);
                return new BaseResult<string> { Data = newUser.Id.ToString(), Message = "User Registered Successfully." };
            }
            throw new CustomException($"{result.Errors}") { StatusCode = (int)HttpStatusCode.InternalServerError };
        }

        public async Task<BaseResult<string>> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email!);

            if (user is null)
            {
                return BaseResult<string>.Failure(errors: ["This email was not found."]);
            }

            // Check if the reset code is expired or invalid
            if (user.ResetCode is null || user.ValidFor < DateTime.Now || user.ResetCode != resetPasswordDto.ResetCode)
            {
                user.ResetCode = null;
                user.ValidFor = null;
                await _userManager.UpdateAsync(user);
                return BaseResult<string>.Failure(errors: ["Invalid or expired reset code."]);
            }

            // Reset the password
            var resetResult = await _userManager.RemovePasswordAsync(user);
            if (!resetResult.Succeeded)
            {
                return BaseResult<string>.Failure(errors: ["Failed to reset password."]);
            }

            resetResult = await _userManager.AddPasswordAsync(user, resetPasswordDto.NewPassword);
            if (!resetResult.Succeeded)
            {
                return BaseResult<string>.Failure(errors: resetResult.Errors.Select(e => e.Description).ToList());
            }

            
            user.ResetCode = null;
            user.ValidFor = null;
            await _userManager.UpdateAsync(user);

            return BaseResult<string>.Success(data: resetPasswordDto.Email);
        }
        public async Task<BaseResult<string>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);

            if (user is null)
            {
                return BaseResult<string>.Failure(errors: ["This Email Not Found"]);
            }

            
            var resetCode = GenerateRandomCode(5);
            var validFor = DateTime.Now.AddMinutes(30);

            
            user.ResetCode = resetCode;
            user.ValidFor = validFor;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BaseResult<string>.Failure(errors: ["Failed to generate reset code. Try again."]);
            }

            // Email body
            var emailBody = $@"
    <html>
    <body style='text-align: center; font-family: Arial, sans-serif;'>
        <h4>Reset Your Password</h4>
        <p>Here is The Reset Code:</p> 
        <p style='font-size: 28px; font-weight: bold; color: #d32f2f; margin-top: 10px; letter-spacing: 3px;'>{resetCode}</p>
    </body>
    </html>";

            var message = new EmailDto
            {
                To = [forgotPasswordDto.Email],
                Subject = "Reset Password",
                Body = emailBody
            };

            await _emailService.SendEmail(message);

            return BaseResult<string>.Success(message: "Reset code sent to your email.", data: forgotPasswordDto.Email);
        }

        public string GenerateRandomCode(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            string result = "";
            Random random = new Random();
            for (int i = 0; i< length; i++)
            {
                result += chars[random.Next(chars.Length)];
            }
            return result;
        }

        public async Task<BaseResult<TokenDto>> GoogleLoginAsync(string gtoken,bool isStudentActivity)
        {
            var payload = GoogleJsonWebSignature.ValidateAsync(gtoken, new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { _configuration["Google:ClientId"] } }).Result;
            var user = await _userManager.FindByEmailAsync(payload.Email);
            var validFor = 24 * 60 * 60;
            if (user == null)
            {
                var newUser = new AppUser
                {
                    Email = payload.Email,
                    UserName = payload.Email.ToLower(),
                    

                };
                if (isStudentActivity) newUser.StudentActivity = new StudentActivity();
                else newUser.Student = new Student();
                    var userResult = await _userManager.CreateAsync(newUser);

                if (!userResult.Succeeded)
                {
                    throw new CustomException($"{userResult.Errors}") { StatusCode = (int)HttpStatusCode.InternalServerError };
                }
                
                var roleResult = await _userManager.AddToRoleAsync(newUser, isStudentActivity?"StudentActivity":"Student");
                user = newUser;

            }
            var token = new TokenDto
            {
                TokenType = "bearer",
                ExpiresIn = validFor,
                AccessToken = await _tokenService.GenerateToken(user, validFor)
            };
            return new BaseResult<TokenDto> { Data = token, Message = "User logged in successfully." };
        }
    }
}
