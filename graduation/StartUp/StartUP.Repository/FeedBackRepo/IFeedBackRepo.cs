using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.FeedBackRepo
{
    public interface IFeedBackRepo
    {
        Task<IEnumerable<FeedBack>> GetAllAsync();
        Task<FeedBack> GetByIdAsync(int id);
        Task<IEnumerable<FeedBack>> GetByUserIdAsync(int id);
        Task<IEnumerable<FeedBack>> GetRandomFeedBackAsync(int count);

        Task<User> GetByUserAsync(string username);
        Task<bool> AddAsync(FeedBack feedback);
    }
}
