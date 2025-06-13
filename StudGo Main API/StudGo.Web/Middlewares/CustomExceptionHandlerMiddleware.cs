using Microsoft.Extensions.Logging;
using StudGo.Service.Helpers;
using System.Net;
using System.Text.Json;

namespace StudGo.Web.Middlewares
{
    public class CustomExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionHandlerMiddleware> _logger;

        public CustomExceptionHandlerMiddleware(RequestDelegate next, ILogger<CustomExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";
                var responseModel = BaseResult<object>.Failure(errors :[error.Message]);

                switch (error)
                {
                    case CustomException e:
                        // Log custom exceptions at warning level
                        _logger.LogWarning("Custom exception occurred: {Message}", e.Message);
                        response.StatusCode = e.StatusCode;
                        break;
                    default:
                        // Log unexpected exceptions at error level
                        _logger.LogError(error, "An unhandled exception occurred.");
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }

                var result = JsonSerializer.Serialize(responseModel);
                await response.WriteAsync(result);
            }
        }
    }
}