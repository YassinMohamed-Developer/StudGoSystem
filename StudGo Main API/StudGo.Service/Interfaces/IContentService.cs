using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;

namespace StudGo.Service.Interfaces
{
    public interface IContentService
    {
        Task<BaseResult<string>> AddContentAsync(ContentRequestDto input,int activityId,string appUserId);
        Task<BaseResult<string>> UpdateContentAsync(ContentRequestDto input, int contentId, string appUserId);
        Task<BaseResult<string>> DeleteContentAsync(int contentId, string appUserId);
        Task<BaseResult<ContentResponseDto>> GetContentAsync(int contentId);
        Task<BaseResult<IReadOnlyList<ContentResponseDto>>> GetActivityContents(int activityId);

    }
}
