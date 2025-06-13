using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Implementations
{
	public class EmailService : IEmailService
	{
		private MailSettingsOption _options;

		public EmailService(IOptions<MailSettingsOption> options)
		{
			_options = options.Value;
		}
		public async Task SendEmail(EmailDto emailDto)
		{

			var mail = new MimeMessage
			{
				Sender = MailboxAddress.Parse(_options.Email),
				Subject = emailDto.Subject,
			};

			foreach (var email in emailDto.To)
			{
				mail.To.Add(MailboxAddress.Parse(email));
			}
			mail.From.Add(new MailboxAddress(_options.DisplayName, _options.Email));

			var builder = new BodyBuilder();
			builder.HtmlBody = emailDto.Body;

			
			mail.Body = builder.ToMessageBody();

			using var smtp = new SmtpClient();

			await smtp.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);

			await smtp.AuthenticateAsync(_options.Email, _options.Password);

			await smtp.SendAsync(mail);

			await smtp.DisconnectAsync(true);
		}
	}
}
