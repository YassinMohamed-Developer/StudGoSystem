using StudGo.Service.Dtos.Queries;
using StudGo.Service.Dtos.RequestDtos;
using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Interfaces
{
    public interface IInternshipService
    {
        public Task<BaseResult<string>> AddInternShip(InternShipRequestDto input);

        public Task<BaseResult<string>> DeleteInternShip(int InternShipId);

        public Task<BaseResult<string>> UpdateInternShip(InternShipRequestDto input, int InternShipId);

        public Task<BaseResult<InternShipResponseDto>> GetInternShipById(int InternShipId);

        public Task<BaseResult<IReadOnlyList<InternShipResponseDto>>> GetAllInternShips();

        public Task<BaseResult<string>> AddInternShipAsList(List<InternShipRequestDto> inputs);

        public Task<BaseResult<IReadOnlyList<InternShipResponseDto>>> GetInternShipFilter(InternShipQuery internShipQuery);
    }
}
