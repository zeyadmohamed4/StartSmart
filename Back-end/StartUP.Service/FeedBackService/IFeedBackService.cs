using StartUP.Data.Entity;
using StartUP.Service.Dtos.FeedBack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.FeedBackService
{
    public interface IFeedBackService
    {
        Task<IEnumerable<FeedBackDto>> GetAllAsync();
        Task<FeedBackDto> GetByIdAsync(int id);
        Task<IEnumerable<FeedBackDto>> GetRandomStoriesAsync(int count);
        Task<IEnumerable<FeedBackDto>> GetByUserNameAsync(string username);
        Task<bool> AddAsync(FeedBackDto feedback , string unsername);
    }
}
