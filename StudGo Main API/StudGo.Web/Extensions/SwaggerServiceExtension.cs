using Microsoft.OpenApi.Models;

namespace StudGo.Web.Extensions
{
    public static class SwaggerServiceExtension
    {
        public static void AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(
                    "v1",
                    new OpenApiInfo
                    {
                        Title = "StudGoApi",
                        Version = "v1",
                        //Contact = new OpenApiContact
                        //{
                        //    Name = "YTEAM",
                        //    //Email = "routeacademy@gmail.com"
                        //}
                    });
                var securityScheme = new OpenApiSecurityScheme
                {
                    Description = "JWT Autho",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Id = "bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                };
                options.AddSecurityDefinition("bearer", securityScheme);

                var securityRequirements = new OpenApiSecurityRequirement
                {
                    {securityScheme,new[]{ "bearer"} }
                };

                options.AddSecurityRequirement(securityRequirements);
            });
        }
    }
}
