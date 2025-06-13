
using Microsoft.EntityFrameworkCore;
using StudGo.Data.Contexts;
using StudGo.Service.Helpers;
using StudGo.Web.Extensions;
using StudGo.Web.Helpers;
using StudGo.Web.Middlewares;

namespace StudGo.Web
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerDocumentation();

            builder.Services.Configure<MailSettingsOption>(builder.Configuration.GetSection("MailSettings"));
            builder.Services.AddDbContext<StudGoDbContext>(options =>
            {
                options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("StudGoDefault"));
            });

            builder.Services.AddApplicationServiceExtension();
            builder.Services.AddIdentityService(builder.Configuration);
           
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            });




			var app = builder.Build();
			await ApplySeeding.ApplySeedingAsync(app);
            app.UseMiddleware<CustomExceptionHandlerMiddleware>();


            app.UseSwagger();
            app.UseSwaggerUI();
            
            app.UseHttpsRedirection();

            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
