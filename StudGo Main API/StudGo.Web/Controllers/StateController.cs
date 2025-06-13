using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StateController : ControllerBase
    {
		private readonly IStateService _service;

		public StateController(IStateService service)
		{
			_service = service;
		}

		[HttpGet]

		public async Task<ActionResult> GetStates()
		{
			var result = await _service.GetStates();

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}
	}
}
