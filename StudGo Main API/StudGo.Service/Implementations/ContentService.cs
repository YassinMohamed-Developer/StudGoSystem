using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Implementations
{
	public class ContentService : IContentService
	{
		private readonly StudGoDbContext _dBcontext;
		private readonly IMapper _mapper;

		public ContentService(StudGoDbContext DBcontext,IMapper mapper)
		{
			_dBcontext = DBcontext;
			_mapper = mapper;
		}
		public async Task<BaseResult<string>> AddContentAsync(ContentRequestDto input, int activityId, string appUserId)
		{
			var StudnetActivity = await _dBcontext.StudentActivities.FirstOrDefaultAsync(A => A.AppUserId == appUserId);

			if(StudnetActivity is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}

			var Activity = await _dBcontext.Activities.FirstOrDefaultAsync(A => A.Id == activityId && A.StudentActivityId == StudnetActivity.Id);

			if(Activity is null)
			{
				return BaseResult<string>.Failure(errors: ["Activity Not Found"]);
			}

			var MapContent = _mapper.Map<Content>(input);

			MapContent.ActivityId = Activity.Id;

			await _dBcontext.Contents.AddAsync(MapContent);
			await _dBcontext.SaveChangesAsync();

			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<string>> DeleteContentAsync(int contentId, string appUserId)
		{
			var StudentActivtiy = await _dBcontext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

			if(StudentActivtiy is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}

			var Content = await _dBcontext.Contents.FirstOrDefaultAsync(C => C.Id == contentId);

			if(Content is null)
			{
				return BaseResult<string>.Failure(errors: ["The Content Is Not Found to Delete it"]);
			}

            if (!_dBcontext.Activities.Any(a => a.Id == Content.ActivityId && a.StudentActivityId == StudentActivtiy.Id))
			{
                return BaseResult<string>.Failure(errors: ["You are not allowed to delete this content"]);
            }

            _dBcontext.Contents.Remove(Content);
			await _dBcontext.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<IReadOnlyList<ContentResponseDto>>> GetActivityContents(int activityId)
		{
			var Activity = await _dBcontext.Activities.FirstOrDefaultAsync(A => A.Id == activityId);

			if(Activity is null)
			{
				return BaseResult<IReadOnlyList<ContentResponseDto>>.Failure(errors: ["Activity Is Not Found"]);
			}

			var Contents = Activity.Contents;

			var MapContents = _mapper.Map<IReadOnlyList<ContentResponseDto>>(Contents);

			return BaseResult<IReadOnlyList<ContentResponseDto>>.Success(data: MapContents);
		}

		public async Task<BaseResult<ContentResponseDto>> GetContentAsync(int contentId)
		{
			var Content = await _dBcontext.Contents.FirstOrDefaultAsync(C => C.Id == contentId);

			if(Content is null)
			{
				return BaseResult<ContentResponseDto>.Failure(errors: ["Content is Not Found"]);
			}

			var MapContent = _mapper.Map<ContentResponseDto>(Content);

			return BaseResult<ContentResponseDto>.Success(data: MapContent);
		}

		public async Task<BaseResult<string>> UpdateContentAsync(ContentRequestDto input, int contentId, string appUserId)
		{
			var StudentActivity = await _dBcontext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);

			if(StudentActivity is null)
			{
				return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
			}
			var Content = await _dBcontext.Contents.FirstOrDefaultAsync(C => C.Id == contentId);

			if(Content is null)
			{
				return BaseResult<string>.Failure(errors: ["Content Not Found to Update It"]);
			}

			if(!_dBcontext.Activities.Any(a => a.Id == Content.ActivityId && a.StudentActivityId == StudentActivity.Id))
			{
                return BaseResult<string>.Failure(errors: ["You are not allowed to update this content"]);
            }

			var ContentMap = _mapper.Map(input, Content);
			await _dBcontext.SaveChangesAsync();
			return BaseResult<string>.Success();
		}
	}
}
