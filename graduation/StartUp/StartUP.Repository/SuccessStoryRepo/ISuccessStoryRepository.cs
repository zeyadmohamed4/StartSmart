using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.SuccessStoryRepo
{
    public interface ISuccessStoryRepository
    {
        Task<IEnumerable<SuccessStory>> GetAllAsync();
        Task<SuccessStory> GetByIdAsync(int id);
        Task<Project> GetByProjectNameAsync(string projectname);

        Task<IEnumerable<SuccessStory>> GetByUserIdAsync(int userId);
        Task<IEnumerable<SuccessStory>> GetRandomStoriesAsync(int count);
        Task<User> GetByUserAsync(string username);
        Task<Project> GetProjectAsync(string username);
        Task<bool> AddAsync(SuccessStory successStory);
        Task<IEnumerable<SuccessStory>> GetPendingAddSuccessStoryAsync();
        Task<bool> UpdateAsync(SuccessStory successStory);
        Task Delete(SuccessStory successStory);
    }
}
