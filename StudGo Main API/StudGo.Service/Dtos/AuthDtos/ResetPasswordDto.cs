using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Dtos.AuthDtos
{
    public class ResetPasswordDto
    {
        [Required]
		//[RegularExpression("^[A-Z][A-Za-z\\d@$!%*?&#^(){}[\\]<>_+=|\\\\~`:;,.\\/-]{5,}$")]
		public string NewPassword { get; set; }
		[Required]
		[Compare("NewPassword", ErrorMessage = "Password doesn't Match The ConfirmPassword")]
		public string ConfirmPassword { get; set; }

		[EmailAddress]
		public string Email { get; set; }

		[Required]
        public string ResetCode { get; set; }
    }
}
