using StudGo.Data.Entities;
using StudGo.Service.Dtos.AuthDtos;
using StudGo.Service.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Interfaces
{
    public interface IAuthService
    {
        Task<BaseResult<TokenDto>> LoginAsync(LoginDto input);
        Task<BaseResult<string>> RegisterAsync(RegisterDto input, string accountType);

        Task<BaseResult<string>> ForgotPassword(ForgotPasswordDto forgotPasswordDto);

        Task<BaseResult<string>> ResetPassword(ResetPasswordDto resetPasswordDto);

        Task<BaseResult<TokenDto>> GoogleLoginAsync(string gtoken ,bool isStudentActivity);
    }
}
