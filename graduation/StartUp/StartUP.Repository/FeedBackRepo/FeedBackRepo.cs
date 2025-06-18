using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.FeedBackRepo
{
    public class FeedBackRepo : IFeedBackRepo
    {
        private readonly StartUPContext _context;

        public FeedBackRepo(StartUPContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAsync(FeedBack feedBack)
        {
            _context.FeedBack.Add(feedBack);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<FeedBack>> GetAllAsync()
        {
            return await _context.FeedBack.Include(s => s.User).ToListAsync();
        }

        public async Task<FeedBack> GetByIdAsync(int id)
        {
            return await _context.FeedBack.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task<IEnumerable<FeedBack>> GetByUserIdAsync(int id)
        {
            return await _context.FeedBack.Include(s => s.User).Where(s => s.UserId == id).ToListAsync();
        }

        public async Task<User> GetByUserAsync(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        }


        public async Task<IEnumerable<FeedBack>> GetRandomFeedBackAsync(int count)
        {
            return await _context.FeedBack.Include(f => f.User).OrderBy(r => Guid.NewGuid()).Take(count).ToListAsync();
        }


    }
}
