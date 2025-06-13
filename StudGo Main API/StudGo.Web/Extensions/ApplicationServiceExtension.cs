using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Helpers;
using StudGo.Service.Implementations;
using StudGo.Service.Interfaces;
using StudGo.Service.Profiles;

namespace StudGo.Web.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static void AddApplicationServiceExtension(this IServiceCollection services)
        {



            services.AddAutoMapper(typeof(TeamProfile));
            services.AddAutoMapper(typeof(StudentProfile));
            services.AddAutoMapper(typeof(StudentActivityProfile));
            services.AddAutoMapper(typeof(StudentActivityProfile));
            services.AddAutoMapper(typeof(InternShipProfile));
            services.AddAutoMapper(typeof(SAPreferenceProfile));

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<IStudentActivityService, StudentActivityService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IContentService, ContentService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<IInternshipService, InternShipService>();
            services.AddScoped<IStateService, StateService>();

			services.Configure<ApiBehaviorOptions>(options =>
			{

				options.InvalidModelStateResponseFactory = actionContext =>
				{
					var errors = actionContext.ModelState
								.Where(model => model.Value?.Errors.Count > 0)
								.SelectMany(model => model.Value.Errors)
								.Select(error => error.ErrorMessage)
								.ToList();
                    var errorResponse = new BaseResult<string>()
                    {
                        IsSuccess = false,
                        Errors = errors
                    };
					return new BadRequestObjectResult(errorResponse);
				};
			});
		}
    }
}
