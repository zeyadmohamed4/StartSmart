using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.UserRepo
{
    public class GoogleLoginRepository : IGoogleLoginRepository
    {
        private readonly StartUPContext _context;

        public GoogleLoginRepository(StartUPContext context)
        {
            _context = context;
        }

        public async Task<GoogleLogin> GetByEmailAsync(string email)
        {
            return await _context.GoogleLogins.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(GoogleLogin login)
        {
            _context.GoogleLogins.Add(login);
            await _context.SaveChangesAsync();
        }
    }
}
