using Microsoft.AspNetCore.Identity;

namespace StudGo.Data.Entities
{
    public class AppUser : IdentityUser
    {
        public virtual Student Student { get; set; }
        public virtual StudentActivity StudentActivity { get; set; }

        public string? ResetCode { get; set; }
        public DateTime? ValidFor { get; set; }
    }
}
