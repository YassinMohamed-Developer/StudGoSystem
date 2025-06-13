using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.AuthDtos
{
    public class GoogleTokenDto
    {
        public string Token { get; set; }
        public bool IsStudentActivity { get; set; } = false;
    }
}
