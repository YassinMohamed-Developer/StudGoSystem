using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Helpers
{
    public class BaseResult<T> where T : class
    {
        public bool IsSuccess { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = [];
        public T? Data { get; set; }

        public int Count { get; set; } = 0;

        public static BaseResult<T> Success(T data = null, string message = "Operation Done Successfully",int count =0)
        {
            return new BaseResult<T> { IsSuccess = true, Data = data, Message = message,Count=count };
        }

        public static BaseResult<T> Failure(string message = "Operation Failed", List<string> errors = null)
        {
            return new BaseResult<T> { IsSuccess = false, Message = message, Errors = errors };
        }

    }
}
