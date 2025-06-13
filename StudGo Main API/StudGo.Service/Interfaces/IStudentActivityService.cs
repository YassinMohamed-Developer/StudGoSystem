using Microsoft.AspNetCore.Http;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.Queries;
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
    public interface IStudentActivityService
    {
        Task<BaseResult<string>> UpsertStudentActivityAsync(StudentActivityRequestDto input, string appUserId);
        Task<BaseResult<StudentActivityResponseDto>> GetProfileAsync(string appUserId);
        Task<BaseResult<string>> UploadProfilePictureAsync(IFormFile picture, string appUserId);
        Task<BaseResult<string>> ToggleFollowingStudentActivityAsync(int studentActivityId, string appUserId);

        Task<BaseResult<StudentActivityResponseDto>> GetStudentActivityByIdAsync(int studentActivityId);
        Task<BaseResult<StudentActivityStatisticsDto>> GetStudentActivityStatisticsAsync(string appUserId);

        Task<BaseResult<IReadOnlyList<StudentActivityResponseDto>>> GetStudentActivitiesAsync(SAQuery query);

        Task<BaseResult<IReadOnlyList<StudentResponseDto>>> GetFollowers(string appUserId);
        Task<BaseResult<string>> IsFollowingSA(string appUserId, int studentActvityId);
        Task<BaseResult<IReadOnlyList<StudentActivityResponseDto>>> SAFollowedByStudent(string appUserId);
        Task<BaseResult<string>> UpdateMyPreference(SAPreferenceRequestDto input, string appUserId);
        Task<BaseResult<SAPreferenceResponseDto>> GetMyPreference(string appUserId);
    }
}
