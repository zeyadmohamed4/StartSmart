using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.SuccessStoryRepo
{
    public class SuccessStoryRepository : ISuccessStoryRepository
    {

        private readonly StartUPContext _context;

        public SuccessStoryRepository(StartUPContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAsync(SuccessStory successStory)
        {
            _context.SuccessStories.Add(successStory);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<SuccessStory>> GetAllAsync()
        {
            return await _context.SuccessStories.Include(s => s.User).Include(s => s.Project).ToListAsync();
        }

        public async Task<SuccessStory> GetByIdAsync(int id)
        {
            return await _context.SuccessStories.Include(s => s.User).Include(s => s.Project).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<SuccessStory>> GetByUserIdAsync(int userId)
        {
            return await _context.SuccessStories.Include(s => s.User).Include(s => s.Project).Where(s => s.UserId == userId).ToListAsync();
        }

        public async Task<User> GetByUserAsync(string username)
        {
            return await _context.Users.Include(s => s.SuccessStories).FirstOrDefaultAsync(u => u.UserName == username);
        }


        public async Task<Project> GetProjectAsync(string userName)
        {
            return await _context.Projects
                .Include(p => p.User) 
                .FirstOrDefaultAsync(p => p.User.UserName == userName);
        }

        public async Task<IEnumerable<SuccessStory>> GetRandomStoriesAsync(int count)
        {
            return await _context.SuccessStories.Include(s => s.User).Include(s => s.Project)
                .OrderBy(r => Guid.NewGuid()).Take(count).ToListAsync();
        }

        public async Task<IEnumerable<SuccessStory>> GetPendingAddSuccessStoryAsync()
        {
            return await _context.SuccessStories.Include(s => s.User).Include(s => s.Project).Where(p => p.IsActive == false).ToListAsync();
        }
        public async Task<bool> UpdateAsync(SuccessStory successStory)
        {

            _context.Update(successStory);
            return await _context.SaveChangesAsync() > 0;

        }
        public async Task Delete(SuccessStory successStory)
        {
            _context.SuccessStories.Remove(successStory);
            await _context.SaveChangesAsync();
        }

        public  async Task<Project> GetByProjectNameAsync(string projectname)
        {
            return await _context.Projects.Include(s => s.User).FirstOrDefaultAsync(s => s.ProjectName== projectname);

        }
    }
}
