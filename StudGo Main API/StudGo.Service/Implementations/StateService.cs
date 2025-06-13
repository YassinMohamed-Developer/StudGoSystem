using Microsoft.EntityFrameworkCore;
using StudGo.Data.Contexts;
using StudGo.Data.Enums;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Implementations
{
	public class StateService : IStateService
	{
		private readonly StudGoDbContext _context;

		public StateService(StudGoDbContext context)
		{
			_context = context;
		}
		public async Task<BaseResult<StatsDto>> GetStates()
		{
			var State = new StatsDto
			{
				ActiveStudents = await _context.Students.CountAsync(),
				UpcomingActivities = await _context.Activities.CountAsync(x => x.StartDate >= DateTime.Now),
				TotalActivities = await _context.Activities.CountAsync(),
				InternshipOpportunities = await _context.InternShips.CountAsync(),
				AppliedEvents = await _context.Activities.CountAsync(x => x.Students.Any() && x.ActivityType == ActivityType.Event),
                AppliedWorkshops = await _context.Activities.CountAsync(x => x.Students.Any() && x.ActivityType == ActivityType.Workshop),
                ActiveOrganizations = await _context.StudentActivities.CountAsync(),
			};

			return BaseResult<StatsDto>.Success(data:State);
		}
	}
}
