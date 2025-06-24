using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.UserRepo
{
    public interface  IGoogleLoginRepository
    {
        Task<GoogleLogin> GetByEmailAsync(string email);
        Task AddAsync(GoogleLogin login);
    }
}
