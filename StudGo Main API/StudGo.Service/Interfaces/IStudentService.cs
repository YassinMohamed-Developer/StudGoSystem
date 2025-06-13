using Microsoft.AspNetCore.Http;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Interfaces
{
    public interface IStudentService
    {
        Task<BaseResult<string>> UpsertStudent(StudentRequestDto input, string appUserId);
        Task<BaseResult<StudentResponseDto>> GetProfile(string userId);
        Task<BaseResult<string>> UploadCv(IFormFile cv, string appUserId);
        Task<BaseResult<string>> UploadProfilePicture(IFormFile picture, string appUserId);

        Task<BaseResult<string>> DeleteProfilePicture(string appUserId);
        Task<BaseResult<string>> DeleteCv(string appUserId);





    }
}
