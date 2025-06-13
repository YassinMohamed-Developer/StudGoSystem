using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Helpers.Settings;
using StudGo.Service.Interfaces;

namespace StudGo.Service.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly StudGoDbContext _studGoDbContext;
        private readonly IMapper _mapper;
		private readonly IConfiguration _configuration;

		public StudentService(UserManager<AppUser> userManager, StudGoDbContext studGoDbContext, IMapper mapper,IConfiguration configuration)
        {
            _userManager = userManager;
            _studGoDbContext = studGoDbContext;
            _mapper = mapper;
			_configuration = configuration;
		}
        public async Task<BaseResult<string>> UpsertStudent(StudentRequestDto input, string appUserId)
        {
            var user = await _userManager.FindByIdAsync(appUserId);
            if (user == null)
            {
                return BaseResult<string>.Failure(errors:["Invalid App User"]);
            }

            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (string.IsNullOrEmpty(input.Address))
            {
                string locationInText = LocationSettings.GetAddressFromCoordinatesAsync(input.Latitude, input.Longitude).Result;
                input.Address = locationInText;
            }
            if (student == null)
            {

                student = _mapper.Map<Student>(input);
                student.AppUserId = appUserId;
                await _studGoDbContext.Students.AddAsync(student);
            }
            else
            {
                _mapper.Map(input, student);
            }

            await _studGoDbContext.SaveChangesAsync();

            return BaseResult<string>.Success(data: student.Id.ToString());
        }
        public async Task<BaseResult<StudentResponseDto>> GetProfile(string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<StudentResponseDto>.Failure(errors: ["Student not found."]);
            }
            var studentResponseDto = _mapper.Map<StudentResponseDto>(student);
            return BaseResult<StudentResponseDto>.Success(data: studentResponseDto);
        }
        public async Task<BaseResult<string>> UploadCv(IFormFile cv, string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Student not found."]);
            }

            if (string.IsNullOrEmpty(student.CvUrl) == false)
            {
                var isDeleted = DocumentSettings.DeleteFile(student.CvUrl);
                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Deleted Correctly"]);
                }
            }

            try
            {
                var fileName = DocumentSettings.UploadFile(cv, "students/cvs");
                if (string.IsNullOrEmpty(fileName))
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Saved Correctly"]);
                }

                student.CvUrl = fileName;
                await _studGoDbContext.SaveChangesAsync();

                return BaseResult<string>.Success(data: $"{_configuration["BaseUrl"]}/{fileName}");
            }
            catch (Exception ex)
            {
                return BaseResult<string>.Failure(errors: [ex.Message]);
            }
        }
        public async Task<BaseResult<string>> UploadProfilePicture(IFormFile picture, string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Student IS not found"]);
            }

            if (string.IsNullOrEmpty(student.PictureUrl) == false)
            {
                var isDeleted = DocumentSettings.DeleteFile(student.PictureUrl);
                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Deleted Correctly"]);
                }
            }
            try
            {
                var fileName = DocumentSettings.UploadFile(picture, "students/pictures");
                if (string.IsNullOrEmpty(fileName))
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Saved Correctly"]);
                }

                student.PictureUrl = fileName;
                await _studGoDbContext.SaveChangesAsync();

                return BaseResult<string>.Success(data: $"{_configuration["BaseUrl"]}/{fileName}");
            }
            catch (Exception ex)
            {
                return BaseResult<string>.Failure(errors: [ex.Message]);
            }
        }

        public async Task<BaseResult<string>> DeleteCv(string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Student not found."]);
            }
            if (string.IsNullOrEmpty(student.CvUrl))
            {
                return BaseResult<string>.Failure(errors: ["Student has no CV."]);
            }
            try
            {
                var isDeleted = DocumentSettings.DeleteFile(student.CvUrl);
                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Deleted Correctly"]);
                }
                student.CvUrl = null;
                await _studGoDbContext.SaveChangesAsync();
                return BaseResult<string>.Success();
            }
            catch (Exception ex)
            {
                return BaseResult<string>.Failure(errors: [ex.Message]);
            }
        }

        public async Task<BaseResult<string>> DeleteProfilePicture(string appUserId)
        {
            var student = await _studGoDbContext.Students.FirstOrDefaultAsync(s => s.AppUserId == appUserId);
            if (student == null)
            {
                return BaseResult<string>.Failure(errors: ["Student not found."]);
            }
            if (string.IsNullOrEmpty(student.PictureUrl))
            {
                return BaseResult<string>.Failure(errors: ["Student has no picture."]);
            }
            try
            {
                var isDeleted = DocumentSettings.DeleteFile(student.PictureUrl);
                if (!isDeleted)
                {
                    return BaseResult<string>.Failure(errors: ["Document Not Deleted Correctly"]);
                }
                student.PictureUrl = null;
                await _studGoDbContext.SaveChangesAsync();
                return BaseResult<string>.Success();
            }
            catch (Exception ex)
            {
                return BaseResult<string>.Failure(errors: [ex.Message]);
            }
        }
    }
}
