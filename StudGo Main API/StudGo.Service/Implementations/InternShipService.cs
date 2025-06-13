using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudGo.Data.Contexts;
using StudGo.Data.Entities;
using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using StudGo.Service.Interfaces;

namespace StudGo.Service.Implementations
{
	public class InternShipService : IInternshipService
	{
		private readonly StudGoDbContext _context;
		private readonly IMapper _mapper;

		public InternShipService(StudGoDbContext context,IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}
		public async Task<BaseResult<string>> AddInternShip(InternShipRequestDto input)
		{

			var map = _mapper.Map<InternShip>(input);
			await _context.InternShips.AddAsync(map);
			await _context.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<string>> AddInternShipAsList(List<InternShipRequestDto> inputs)
		{

			var map = _mapper.Map<List<InternShip>>(inputs.ToList());
			
			await _context.InternShips.AddRangeAsync(map);
			await _context.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<string>> DeleteInternShip(int InternShipId)
		{
			var internship = await _context.InternShips.FirstOrDefaultAsync(x => x.Id == InternShipId);

			if(internship is null)
			{
				return BaseResult<string>.Failure(errors: ["InternShip Not Found to Delete it"]);
			}

			 _context.InternShips.Remove(internship);
			await _context.SaveChangesAsync();
			return BaseResult<string>.Success();
		}

		public async Task<BaseResult<IReadOnlyList<InternShipResponseDto>>> GetAllInternShips()
		{
			var internships = _context.InternShips.ToList();

			if(internships  is null)
			{
				return BaseResult<IReadOnlyList<InternShipResponseDto>>.Failure(errors: ["There No InternShips Added"]);
			}

			var map = _mapper.Map<IReadOnlyList<InternShipResponseDto>>(internships);

			return BaseResult<IReadOnlyList<InternShipResponseDto>>.Success(data: map);
		}

		public async Task<BaseResult<InternShipResponseDto>> GetInternShipById(int InternShipId)
		{
			var internship = await _context.InternShips.FirstOrDefaultAsync(x => x.Id == InternShipId);

			if (internship is null)
			{
				return BaseResult<InternShipResponseDto>.Failure(errors: ["InternShip Not Found"]);
			}

			var map = _mapper.Map<InternShipResponseDto>(internship);

			return BaseResult<InternShipResponseDto>.Success(data: map);
		}

		public async Task<BaseResult<IReadOnlyList<InternShipResponseDto>>> GetInternShipFilter(InternShipQuery internShipQuery)
		{
			var internship = _context.InternShips.AsQueryable();

			if (!string.IsNullOrEmpty(internShipQuery.Company))
			{
				internship = internship.Where(x => x.Company.ToLower().Contains(internShipQuery.Company.ToLower()));
			}

			if (!string.IsNullOrEmpty(internShipQuery.JobTitle))
			{
				internship = internship.Where(x => x.JobTitle.ToLower().Contains(internShipQuery.JobTitle.ToLower()));
			}

			if (!string.IsNullOrEmpty(internShipQuery.JobRequirements))
			{
				internship = internship.Where(x => x.JobRequirements.ToLower().Contains(internShipQuery.JobRequirements.ToLower()));
			}
            var Count = await internship.CountAsync();
            if (internShipQuery.PageIndex is not null && internShipQuery.PageSize is not null)
			{
				internship = internship.Skip((int)internShipQuery.PageIndex * (int)internShipQuery.PageSize).Take((int)internShipQuery.PageSize);
			}
			

			var mappInternShip = _mapper.Map<IReadOnlyList<InternShipResponseDto>>(internship);

			return BaseResult<IReadOnlyList<InternShipResponseDto>>.Success(data:mappInternShip,count:Count);
		}

		public async Task<BaseResult<string>> UpdateInternShip(InternShipRequestDto input, int InternShipId)
		{
			var internship = await _context.InternShips.FirstOrDefaultAsync(x => x.Id == InternShipId);

			if (internship is null)
			{
				return BaseResult<string>.Failure(errors: ["InternShip Not Found"]);
			}
			_mapper.Map(input, internship);
			await _context.SaveChangesAsync();
			return BaseResult<string>.Success();
		}
	}
}
