using StartUP.Data.Entity;
using StartUP.Repository.FeedBackRepo;
using StartUP.Service.Dtos.FeedBack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.FeedBackService
{
    public class FeedBackService : IFeedBackService
    {
        private readonly IFeedBackRepo _repository;

        public FeedBackService(IFeedBackRepo repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddAsync(FeedBackDto feedbackDto , string username)
        {
            var user = await _repository.GetByUserAsync(username);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            var feedback = new FeedBack
            {
                Massage = feedbackDto.Massage,
                UserId = user.Id,
                Stars = feedbackDto.Stars,
            };

            return await _repository.AddAsync(feedback);
        }
        public async Task<IEnumerable<FeedBackDto>> GetAllAsync()
        {

            var feedBacks = await _repository.GetAllAsync();
            return feedBacks.Select(s => new FeedBackDto
            {
                Massage = s.Massage,
                UserName = s.User.UserName,
                Stars = s.Stars

            });
        }

        public async Task<FeedBackDto> GetByIdAsync(int id)
        {
            var feedBack = await _repository.GetByIdAsync(id);
            if (feedBack == null) return null;

            return new FeedBackDto
            {
                Massage = feedBack.Massage,
                UserName = feedBack.User.UserName,
                Stars = feedBack.Stars

            };
        }

        public async Task<IEnumerable<FeedBackDto>> GetByUserNameAsync(string username)
        {
            var user = await _repository.GetByUserAsync(username);
            if (user == null) return Enumerable.Empty<FeedBackDto>();

            var feedBacks = await _repository.GetByUserIdAsync(user.Id);
            if (!feedBacks.Any()) return Enumerable.Empty<FeedBackDto>();

            return feedBacks.Select(s => new FeedBackDto
            {
                Massage = s.Massage,
                UserName = s.User?.UserName,
                Stars = s.Stars

            }).ToList();
        }
        public async Task<IEnumerable<FeedBackDto>> GetRandomStoriesAsync(int count)
        {
            var feedBacks = await _repository.GetRandomFeedBackAsync(count);
            return feedBacks.Select(s => new FeedBackDto
            {
                Massage = s.Massage,
                UserName = s.User.UserName,
                Stars = s.Stars

            });
        }


    }
}
