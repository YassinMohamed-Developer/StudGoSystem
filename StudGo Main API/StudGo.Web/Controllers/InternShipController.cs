using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Interfaces;

namespace StudGo.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class InternShipController : ControllerBase
    {
		private readonly IInternshipService _service;

		public InternShipController(IInternshipService service)
		{
			_service = service;
		}

		[HttpPost]

		public async Task<ActionResult> AddInternShip([FromBody]InternShipRequestDto input)
		{
			var result = await _service.AddInternShip(input);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpDelete("{InternShipId}")]

		public async Task<ActionResult> DeleteInternShip(int InternShipId)
		{
			var result = await _service.DeleteInternShip(InternShipId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpPut]

		public async Task<ActionResult> UpdateInternShip(int InternShipId, [FromBody] InternShipRequestDto input)
		{
			var result = await _service.UpdateInternShip(input, InternShipId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpGet("{InternShipId}")]

		public async Task<ActionResult> GetInternShip(int InternShipId)
		{
			var result = await _service.GetInternShipById(InternShipId);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpGet("All")]

		public async Task<ActionResult> GetAllInternShip()
		{
			var result = await _service.GetAllInternShips();

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpPost]

		public async Task<ActionResult> AddListOfInternShip([FromBody] List<InternShipRequestDto> input)
		{
			var result = await _service.AddInternShipAsList(input);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpGet("filter")]

		public async Task<ActionResult> GetInternShip([FromQuery]InternShipQuery internShipQuery)
		{
			var result = await _service.GetInternShipFilter(internShipQuery);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}
			return Ok(result);
		}
	}
}
