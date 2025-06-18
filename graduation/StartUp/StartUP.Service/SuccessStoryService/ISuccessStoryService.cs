using StartUP.Service.Dtos.Project;
using StartUP.Service.Dtos.SuccessStory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.SuccessStoryService
{
    public interface ISuccessStoryService
    {
        Task<IEnumerable<SuccessStoryDto>> GetAllAsyncWithDescription();
        Task<IEnumerable<SuccessStoryDto>> GetAllAsyncWithOutDescription();
        Task<SuccessStoryDto> GetByIdAsync(int id);
        Task<IEnumerable<SuccessStoryDto>> GetRandomStoriesAsync();
        Task<IEnumerable<SuccessStoryDto>> GetByUserNameAsync(string username);
        Task<IEnumerable<SuccessStoryDto>> GetPendingAddSuccessStoryAsync();
        Task<bool> AcceptSuccessStoryAsync(AcceptDto acceptDto);
        Task<bool> RejectSuccessStoryAsync(AcceptDto acceptDto);
        Task<SuccessStoryDto> AddAsync(SuccessStoryCreateDto dto, string username);
    }
}
