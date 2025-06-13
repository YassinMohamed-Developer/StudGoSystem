using StudGo.Data.Entities;

namespace StudGo.Service.Interfaces
{
    public interface ITokenService
    {
        public Task<string> GenerateToken(AppUser appUser,int validFor);
    }
}
