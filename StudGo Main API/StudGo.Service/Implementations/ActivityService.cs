using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Data.Enums;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Dtos.TemplateDto;
using StudGo.Service.Helpers;
using StudGo.Service.Helpers.Settings;
using StudGo.Service.Interfaces;

namespace StudGo.Service.Implementations
{
    public class ActivityService : IActivityService
    {
        private readonly StudGoDbContext _studGoDbContext;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public ActivityService(StudGoDbContext studGoDbContext,IEmailService emailService, IMapper mapper,IConfiguration configuration)
        {
            _studGoDbContext = studGoDbContext;
            _emailService = emailService;
            _mapper = mapper;
            _configuration = configuration;
        }
        public async Task<BaseResult<string>> AddActivityAsync(ActivityRequestDto input, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            if (string.IsNullOrEmpty(input.Address))
            {
                string locationInText = LocationSettings.GetAddressFromCoordinatesAsync(input.Latitude, input.Longitude).Result;
                input.Address = locationInText;
            }
            var activity = _mapper.Map<Activity>(input);
            activity.StudentActivity = studentActivity;
            await _studGoDbContext.Activities.AddAsync(activity);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }

        public async Task<BaseResult<string>> ApplyForActivity(int activityId, string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == activityId);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            if(student.Activities.Any(a => a.Id == activityId))
            {
                return BaseResult<string>.Failure(errors: ["Already applied"]);
            }
            if(activity.Students.Count >= activity.NumberOfSeats)
            {
                return BaseResult<string>.Failure(errors: ["No seats available"]);
            }

            activity.Students.Add(student);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }

        public async Task<BaseResult<string>> DeleteActivityAsync(int id, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == id && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            _studGoDbContext.Activities.Remove(activity);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }

        public async Task<BaseResult<string>> DeleteAgendaAsync(int activityId, string appUserId)
        {
            var studentActivity = _studGoDbContext.StudentActivities.FirstOrDefault(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = _studGoDbContext.Activities.FirstOrDefault(a => a.Id == activityId && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            if (string.IsNullOrEmpty(activity.AgendaUrl))
            {
                return BaseResult<string>.Failure(errors: ["Agenda not found"]);
            }
            

            var isDeleted = DocumentSettings.DeleteFile(activity.AgendaUrl);
            if (!isDeleted)
            {
                return BaseResult<string>.Failure(errors: ["Agenda not deleted"]);
            }
            activity.AgendaUrl = null;
            _studGoDbContext.Activities.Update(activity);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();


        }


        public async Task<BaseResult<string>> GenerateAgendaAsync(int activityId, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == activityId && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            var agenda = new Agenda
            {
                Activity = activity,
                Contents = activity.Contents.ToList()
            };
            string agendaUrl = await PdfGeneratorSettings.GeneratePdfFromTemplate(1001,agenda);
            if (!string.IsNullOrEmpty(activity.AgendaUrl))
            {
                var isDeleted = DocumentSettings.DeleteFile(activity.AgendaUrl);

                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Agenda not deleted"]);
                }
            }
            activity.AgendaUrl = agendaUrl;
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success(data : $"{_configuration["BaseUrl"]}/{agendaUrl}");
        }

        public async Task<BaseResult<List<ActivityResponseDto>>> GetActivitiesAsync(ActivityQuery activityQuery)
        {
            var activities = _studGoDbContext.Activities.AsQueryable();

            if (Enum.TryParse<ActivityType>(activityQuery.ActivityType,true, out ActivityType activityType))
            {
                activities = activities.Where(a => a.ActivityType == activityType);
            }

            if(Enum.TryParse<ActivityCategory>(activityQuery.ActivityCategory, true, out ActivityCategory activityCategory))
            {
                activities = activities.Where(a => a.ActivityCategory == activityCategory);
            }
            if (activityQuery.StudentActivityId is not null)
            {
                activities = activities.Where(a => a.StudentActivityId == activityQuery.StudentActivityId);
            }
            if (!string.IsNullOrEmpty(activityQuery.StudentActivityName))
            {
                activities = activities.Where(a => a.StudentActivity.Name.ToLower().Contains(activityQuery.StudentActivityName.ToLower()));
            }
            if (!string.IsNullOrEmpty(activityQuery.Name))
            {
                activities = activities.Where(a => a.Title.ToLower().Contains(activityQuery.Name.ToLower()));
            }
            if(activityQuery.IsSortedByStartDate is not null)
            {
                if (activityQuery.IsDescending == true)
                {
                    activities = activities.OrderByDescending(a => a.StartDate);
                }
                else
                    activities = activities.OrderBy(a => a.StartDate);
            }

            var Count = await activities.CountAsync();
            if (activityQuery.PageIndex is not null && activityQuery.PageSize is not null)
            {
                activities = activities.Skip((int)activityQuery.PageIndex * (int)activityQuery.PageSize).Take((int)activityQuery.PageSize);
            }
            var mappedActivities = _mapper.Map<List<ActivityResponseDto>>(activities.ToList());

            return BaseResult<List<ActivityResponseDto>>.Success(data: mappedActivities,count:Count);



        }

        public async Task<BaseResult<List<ActivityResponseDto>>> GetActivitiesBySAAsync(int studentActivityId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.Id == studentActivityId);
            if (studentActivity == null)
            {
                return BaseResult<List<ActivityResponseDto>>.Failure(errors: ["Student Activity not found"]);
            }
            var activities = studentActivity.Activities;
            var mappedActivities = _mapper.Map<List<ActivityResponseDto>>(activities);
            return BaseResult<List<ActivityResponseDto>>.Success(data: mappedActivities);
        }



        public async Task<BaseResult<IReadOnlyList<ActivityResponseDto>>> GetActivitiesByStudentAsync(string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<IReadOnlyList<ActivityResponseDto>>.Failure(errors: ["Profile is not completed"]);
            }
            var activities = student.Activities;
            var mappedActivities = _mapper.Map<IReadOnlyList<ActivityResponseDto>>(activities);
            return BaseResult<IReadOnlyList<ActivityResponseDto>>.Success(data: mappedActivities);

        }

        public async Task<BaseResult<ActivityResponseDto>> GetActivityAsync(int activityId)
        {
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == activityId);
            if (activity == null)
            {
                return BaseResult<ActivityResponseDto>.Failure(errors: ["Activity not found"]);
            }
            var activityResponse = _mapper.Map<ActivityResponseDto>(activity);
            return BaseResult<ActivityResponseDto>.Success(data: activityResponse);
        }

        public async Task<BaseResult<string>> NotifyFollowersAsync(EmailMessageDto emailMessageDto,string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            EmailDto emailDto = new EmailDto
            {

                Subject = "StudGo Announcements",
                #region Email Body
                Body = $@"
        <!DOCTYPE html>
        <html lang=""en"">
        <head>
          <meta charset=""UTF-8"">
          <title>{emailMessageDto.Title}</title>
        </head>
        <body style=""font-family: Arial, sans-serif; background-color: #f9f9f9; text-align: center; padding: 40px;"">
          <div style=""background-color: #fff; border-radius: 10px; padding: 40px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);"">
            <div style=""font-size: 60px;"">💻</div>
            <h1 style=""color: #333;"">{emailMessageDto.Title} 🚀</h1>
            <p style=""color: #666; font-size: 16px;"">{emailMessageDto.message}</p>
            <div style=""font-size: 40px; margin: 20px 0;"">🧠 💰 🗃️ 🌐</div>
        <a href=""https://studgooo.netlify.app/studentactivity/{studentActivity.Id}"" style=""display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #6c63ff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;"">
          EXPLORE TECH NOW
        </a>
          </div>
        </body>
        </html>", 
                #endregion 
                To = studentActivity.Students.Select(s => s.ContactEmail).ToList()
            };
            await _emailService.SendEmail(emailDto);
            return BaseResult<string>.Success();

        }

        public async Task<BaseResult<string>> ToggleActivityAsync(int id, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == id && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            activity.IsOpened = !activity.IsOpened;
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }

        public async Task<BaseResult<string>> UpdateActivityAsync(int activityId,ActivityRequestDto input, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == activityId && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            if (string.IsNullOrEmpty(input.Address))
            {
                string locationInText = LocationSettings.GetAddressFromCoordinatesAsync(input.Latitude, input.Longitude).Result;
                input.Address = locationInText;
            }
            var updatedActivity = _mapper.Map(input, activity);
            await _studGoDbContext.SaveChangesAsync();
            return BaseResult<string>.Success();
        }

        //public Task<BaseResult<string>> UploadAgendaAsync(IFormFile file, string appUserId)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<BaseResult<string>> IsStudentAppliedToActivity(string appUserId,int activityId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = _studGoDbContext.Activities.FirstOrDefault(a => a.Id == activityId);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            if (student.Activities.Any(a => a.Id == activityId))
            {
                return BaseResult<string>.Success();
            }
            return BaseResult<string>.Failure(errors: ["Not applied"]);


        }

        //public Task<BaseResult<string>> UploadAgendaAsync(IFormFile file, string appUserId)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<BaseResult<string>> UploadPosterAsync(IFormFile file, int activityId, string appUserId)
        {
            var studentActivity = await _studGoDbContext.StudentActivities.FirstOrDefaultAsync(sa => sa.AppUserId == appUserId);
            if (studentActivity == null)
            {
                return BaseResult<string>.Failure(errors: ["Profile is not completed"]);
            }
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id == activityId && a.StudentActivityId == studentActivity.Id);
            if (activity == null)
            {
                return BaseResult<string>.Failure(errors: ["Activity not found"]);
            }
            if (string.IsNullOrEmpty(activity.PosterUrl) == false)
            {
                var isDeleted = DocumentSettings.DeleteFile(activity.PosterUrl);
                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Deleted Correctly"]);
                }
            }
            try
            {
                var fileName = DocumentSettings.UploadFile(file, "activity/posters");
                if (string.IsNullOrEmpty(fileName))
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Saved Correctly"]);
                }

                activity.PosterUrl = fileName;
                await _studGoDbContext.SaveChangesAsync();

                return BaseResult<string>.Success(data: $"{_configuration["BaseUrl"]}/{fileName}");
            }
            catch (Exception ex)
            {
                return BaseResult<string>.Failure(errors: [ex.Message]);
            }
        }

        public async Task<BaseResult<IReadOnlyList<StudentResponseDto>>> GetStudentsByActivity(int activityId)
        {
            var activity = await _studGoDbContext.Activities.FirstOrDefaultAsync(a => a.Id== activityId);
            if (activity is null) return BaseResult<IReadOnlyList<StudentResponseDto>>.Failure(errors: ["Activity is not found"]);
            var students = activity.Students;
            var mappedActivities = _mapper.Map<IReadOnlyList<StudentResponseDto>>(students);
            return BaseResult<IReadOnlyList<StudentResponseDto>>.Success(data: mappedActivities);

        }





    }
}
