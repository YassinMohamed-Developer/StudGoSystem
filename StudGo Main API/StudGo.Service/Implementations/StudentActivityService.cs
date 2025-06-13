using System.Runtime.InteropServices;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Data.Enums;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Helpers.Settings;
using StudGo.Service.Interfaces;

namespace StudGo.Service.Implementations
{
    public class StudentActivityService : IStudentActivityService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly StudGoDbContext _studGoDbContext;
        private readonly IMapper _mapper;
        public StudentActivityService(UserManager<AppUser> userManager, StudGoDbContext studGoDbContext, IMapper mapper)
        {
            _userManager = userManager;
            _studGoDbContext = studGoDbContext;
            _mapper = mapper;
        }
        public async Task<BaseResult<string>> UpsertStudentActivityAsync(StudentActivityRequestDto input, string appUserId)
        {
            var user = await _userManager.FindByIdAsync(appUserId);
            if (user == null)
            {
                return BaseResult<string>.Failure(errors: ["Invalid App User"]);
            }
            if (string.IsNullOrEmpty(input.Address))
            {
                string locationInText = LocationSettings.GetAddressFromCoordinatesAsync(input.Latitude, input.Longitude).Result;
                input.Address = locationInText;
            }
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(s => s.AppUserId == appUserId);

            if (studentActivity == null)
            {

                studentActivity = _mapper.Map<StudentActivity>(input);
                studentActivity.AppUserId = appUserId;
                await _studGoDbContext.StudentActivities.AddAsync(studentActivity);
            }
            else
            {
                _mapper.Map(input, studentActivity);
            }

            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success(data: studentActivity.Id.ToString());
        }
        public async Task<BaseResult<StudentActivityResponseDto>> GetProfileAsync(string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<StudentActivityResponseDto>.Failure(errors: ["Student Activity not found."]);
            }
            var studentActivityResponseDto = _mapper.Map<StudentActivityResponseDto>(studentActivity);
            return BaseResult<StudentActivityResponseDto>.Success(data: studentActivityResponseDto);
        }

        public async Task<BaseResult<StudentActivityStatisticsDto>> GetStudentActivityStatisticsAsync(string appUserId)
        {
            var sa = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (sa == null)
            {
                return BaseResult<StudentActivityStatisticsDto>.Failure(errors: ["Student Activity not found."]);
            }
            var eventCount = 0;
            var courseCount = 0;
            var workshopCount = 0;

            var technicalCount = 0;
            var nonTechnicalCount = 0;
            var mixedCount = 0;

            foreach (var activity in sa.Activities)
            {
                // Count by type
                switch (activity.ActivityType)
                {
                    case ActivityType.Event:
                        eventCount++;
                        break;
                    case ActivityType.Course:
                        courseCount++;
                        break;
                    case ActivityType.Workshop:
                        workshopCount++;
                        break;
                }

                // Count by category
                switch (activity.ActivityCategory)
                {
                    case ActivityCategory.Technical:
                        technicalCount++;
                        break;
                    case ActivityCategory.NonTechnical:
                        nonTechnicalCount++;
                        break;
                    case ActivityCategory.Mixed:
                        mixedCount++;
                        break;
                }
            }

            var saDto = new StudentActivityStatisticsDto
            {
                Id = sa.Id,
                NumOfActivites = sa.Activities.Count,

                NumOfEventActivites = eventCount,
                NumOfCourseActivites = courseCount,
                NumOfWorkshopActivites = workshopCount,

                NumOfTechnicalActivites = technicalCount,
                NumOfNonTechnicalActivites = nonTechnicalCount,
                NumOfMixedActivites = mixedCount,

                NumOfFollowers = sa.Students.Count,
                NumOfTeams = sa.Teams.Count
            };

            return BaseResult<StudentActivityStatisticsDto>.Success(data: saDto);
        }

        public async Task<BaseResult<string>> UploadProfilePictureAsync(IFormFile picture, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Student Activity not found."]);
            }
            try
            {
                var fileName = DocumentSettings.UploadFile(picture, "Pictures");
                if (fileName == null)
                {
                    return BaseResult<string>.Failure(errors: ["File upload failed."]);
                }

                studentActivity.PictureUrl = fileName;
                await _studGoDbContext.SaveChangesAsync();

                return BaseResult<string>.Success(data: fileName);
            }
            catch
            {
                return BaseResult<string>.Failure(errors: ["An error occurred."]);
            }
        }
        public async Task<BaseResult<string>> ToggleFollowingStudentActivityAsync(int studentActivityId, string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed."]);
            }

            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.Id == studentActivityId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Student Activity not found."]);
            }

            if (studentActivity.Students.Any(s => s.AppUserId == appUserId))
            {
                studentActivity.Students.Remove(student);
                await _studGoDbContext.SaveChangesAsync();
                return BaseResult<string>.Success(message: "You are no longer following this Student Activity.");
            }

            studentActivity.Students.Add(student);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success(message: "You are now following this Student Activity.");
        }


        public async Task<BaseResult<StudentActivityResponseDto>> GetStudentActivityByIdAsync(int studentActivityId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(s => s.Id == studentActivityId);
            if (studentActivity == null)
            {
                return BaseResult<StudentActivityResponseDto>.Failure(errors: ["Student Activity not found."]);
            }
            var studentActivityResponseDto = _mapper.Map<StudentActivityResponseDto>(studentActivity);
            return BaseResult<StudentActivityResponseDto>.Success(data: studentActivityResponseDto);



        }

        public async Task<BaseResult<IReadOnlyList<StudentActivityResponseDto>>> GetStudentActivitiesAsync(SAQuery query)
        {
            var studentActivities = _studGoDbContext.StudentActivities.AsQueryable();
            if (!string.IsNullOrEmpty(query.StudentActivityName))
            {
                studentActivities = studentActivities.Where(s => s.Name.ToLower().Contains(query.StudentActivityName.ToLower()));
            }
            if (query.StudentActivityId is not null)
            {
                studentActivities = studentActivities.Where(s => s.Id == query.StudentActivityId);
            }

            if (query.CanApply is not null)
            {
                studentActivities = studentActivities.Where(s => !string.IsNullOrEmpty(s.JoinFormUrl));
            }
            var Count = await studentActivities.CountAsync();
            if (query.PageIndex is not null && query.PageSize is not null)
            {
                studentActivities = studentActivities.Skip((int)query.PageIndex * (int)query.PageSize).Take((int)query.PageSize);
            }

            var mappedStudentActivities = _mapper.Map<IReadOnlyList<StudentActivityResponseDto>>(await studentActivities.ToListAsync());
            return BaseResult<IReadOnlyList<StudentActivityResponseDto>>.Success(data: mappedStudentActivities, count: Count);


        }

        public async Task<BaseResult<IReadOnlyList<StudentResponseDto>>> GetFollowers(string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(S => S.AppUserId == appUserId);
            if (studentActivity is null)
            {
                return BaseResult<IReadOnlyList<StudentResponseDto>>.Failure(errors: ["Profile is not completed"]);
            }
            var followers = studentActivity.Students;
            if (followers is null)
            {
                return BaseResult<IReadOnlyList<StudentResponseDto>>.Failure(errors: ["No followers found"]);
            }
            var mappedFollowers = _mapper.Map<IReadOnlyList<StudentResponseDto>>(followers);
            return BaseResult<IReadOnlyList<StudentResponseDto>>.Success(data: mappedFollowers);
        }

        public async Task<BaseResult<string>> IsFollowingSA(string appUserId, int studentActvityId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed."]);
            }
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.Id == studentActvityId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Student Activity not found."]);
            }
            var isFollowing = studentActivity.Students.Any(s => s.AppUserId == appUserId);
            if (isFollowing)
                return BaseResult<string>.Success(message: "You are following this Student Activity.");
            return BaseResult<string>.Failure(errors: ["You are not following this Student Activity."]);
        }

        public async Task<BaseResult<IReadOnlyList<StudentActivityResponseDto>>> SAFollowedByStudent(string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<IReadOnlyList<StudentActivityResponseDto>>.Failure(errors: ["Profile is not completed."]);
            }
            var studentActivities = student.StudentActivities;
            var mappedStudentActivities = _mapper.Map<IReadOnlyList<StudentActivityResponseDto>>(studentActivities);
            if (mappedStudentActivities is null)
            {
                return BaseResult<IReadOnlyList<StudentActivityResponseDto>>.Failure(errors: ["No Student Activities found."]);
            }
            return BaseResult<IReadOnlyList<StudentActivityResponseDto>>.Success(data: mappedStudentActivities);
        }

        public async Task<BaseResult<SAPreferenceResponseDto>> GetMyPreference(string appUserId)
        {
            var sa = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (sa == null)
            {
                return BaseResult<SAPreferenceResponseDto>.Failure(errors: ["Profile is not completed."]);
            }
            var preferences = await _studGoDbContext.StudentActivityPreferences.FirstOrDefaultAsync(p => p.StudentActivityID == sa.Id);
            var mappedPreferences = _mapper.Map<SAPreferenceResponseDto>(preferences);
            return BaseResult<SAPreferenceResponseDto>.Success(data: mappedPreferences) ;
        }

        public async Task<BaseResult<string>> UpdateMyPreference(SAPreferenceRequestDto input,string appUserId)
        {
            var sa = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (sa == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed."]);
            }
            var preferences = await _studGoDbContext.StudentActivityPreferences.FirstOrDefaultAsync(p => p.StudentActivityID == sa.Id);
            var mappedPreferences = _mapper.Map(input,preferences);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }
    }
}
