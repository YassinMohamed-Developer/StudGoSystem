using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;

namespace StudGo.Service.Interfaces
{
    public interface IActivityService
    {
        Task<BaseResult<string>> AddActivityAsync(ActivityRequestDto input,string appUserId);
        Task<BaseResult<string>> UpdateActivityAsync(int activityId,ActivityRequestDto input, string appUserId);
        Task<BaseResult<string>> DeleteActivityAsync(int id, string appUserId);
        Task<BaseResult<string>> ToggleActivityAsync(int id, string appUserId);

        Task<BaseResult<string>> DeleteAgendaAsync(int activityId, string appUserId);
        Task<BaseResult<string>> GenerateAgendaAsync(int activityId, string appUserId);

        Task<BaseResult<ActivityResponseDto>> GetActivityAsync(int activityId);

        Task<BaseResult<List<ActivityResponseDto>>> GetActivitiesBySAAsync(int studentActivityId);
        Task<BaseResult<List<ActivityResponseDto>>> GetActivitiesAsync(ActivityQuery activityQuery);
        Task<BaseResult<IReadOnlyList<ActivityResponseDto>>> GetActivitiesByStudentAsync(string appUserId);
        Task<BaseResult<string>> ApplyForActivity(int activityId, string appUserId);
        Task<BaseResult<string>> NotifyFollowersAsync(EmailMessageDto emailMessageDto,string appUserId);


        Task<BaseResult<string>> UploadPosterAsync(IFormFile file, int activityId, string appUserId);

        Task<BaseResult<string>> IsStudentAppliedToActivity(string appUserId, int activityId);
        Task<BaseResult<IReadOnlyList<StudentResponseDto>>> GetStudentsByActivity(int activityId);
    }
}
