using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;

namespace StudGo.Service.Interfaces
{
    public interface ITeamService
    {

        Task<BaseResult<string>> AddTeamAsync(TeamRequestDto input, string appUserId);
        Task<BaseResult<string>> UpdateTeamAsync(TeamRequestDto input, int teamId, string appUserId);
        Task<BaseResult<string>> DeleteTeamAsync(int teamId, string appUserId);
        Task<BaseResult<TeamResponseDto>> GetTeamAsync(int teamId);
        //Task<BaseResult<string>> UploadImageAsync(IFormFile file,int teamId, string appUserId);
        Task<BaseResult<IReadOnlyList<TeamResponseDto>>> GetStudentActivitiyTeamsAsync(int StudentActivityId);

    }
}
