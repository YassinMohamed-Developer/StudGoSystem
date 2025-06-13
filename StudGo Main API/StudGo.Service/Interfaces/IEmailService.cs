using StudGo.Service.Dtos.RequestDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Interfaces
{
    public interface IEmailService
    {
		public Task SendEmail(EmailDto emailDto);
	}
}
