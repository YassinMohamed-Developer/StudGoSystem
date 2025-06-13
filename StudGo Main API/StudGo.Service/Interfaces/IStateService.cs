using StudGo.Service.Dtos.ResponseDtos;
using StudGo.Service.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Interfaces
{
    public interface IStateService
    {
        Task<BaseResult<StatsDto>> GetStates();
    }
}
