using Microsoft.AspNetCore.Http;
using StartUP.Data.Entity;
using StartUP.Repository.SuccessStoryRepo;
using StartUP.Service.Dtos.Project;
using StartUP.Service.Dtos.SuccessStory;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StartUP.Service.SuccessStoryService
{
    public class SuccessStoryService : ISuccessStoryService
    {
        private readonly ISuccessStoryRepository _repository;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public SuccessStoryService(ISuccessStoryRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<SuccessStoryDto> AddAsync(SuccessStoryCreateDto dto, string username)
        {
            var user = await _repository.GetByUserAsync(username); // عدلنا هنا

            if (user == null)
            {
                throw new Exception("User not found");
            }

            var project = await _repository.GetByProjectNameAsync(dto.ProjectName); // أو ممكن تعملي GetProjectByUserId لو عندك

            if (project == null)
            {
                throw new Exception("Project not found for this user");
            }

            var successStory = new SuccessStory
            {
                Description = dto.Description,
                UserId = user.Id,
                ProjectId = project.Id
            };

             await _repository.AddAsync(successStory);
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            return new SuccessStoryDto
            {
                Id = project.Id,
                UserId = project.UserId,
                UserImage = string.IsNullOrEmpty(project.User.Image)
                    ? null
                    : $"{baseUrl}/images/{project.User.Image}",
                Description = dto.Description,
                ProjectName = project.ProjectName,
                UserName = project.User.UserName,
                Category = project.Category.ToString(),
                Name = project.User.Name
            };
        }


        public async Task<IEnumerable<SuccessStoryDto>> GetAllAsyncWithDescription()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var stories = await _repository.GetAllAsync();
            return stories.Select(s => new SuccessStoryDto
            {
                Id = s.Id,
                UserId=s.UserId,
                UserImage = string.IsNullOrEmpty(s.User.Image)
                    ? null
                    : $"{baseUrl}/images/{s.User.Image}",
                Description = s.Description,
                ProjectName = s.Project.ProjectName,
                UserName = s.User.UserName,
                Category = s.Project.Category.ToString(),
                Name =s.User.Name

            });
        }

        public async Task<IEnumerable<SuccessStoryDto>> GetAllAsyncWithOutDescription()
        {
            var stories = await _repository.GetAllAsync();
            return stories.Select(s => new SuccessStoryDto
            {
                Id = s.Id,
                UserImage = s.User.Image,
                UserName = s.User.UserName,
                ProjectName = s.Project.ProjectName,
                Category = s.Project.Category.ToString(),
                Name = s.User.Name

            });
        }

        public async Task<SuccessStoryDto> GetByIdAsync(int id)
        {
            var story = await _repository.GetByIdAsync(id);
            if (story == null) return null;

            return new SuccessStoryDto
            {
                Id = story.Id,
                UserImage = story.User.Image,
                Description = story.Description,
                ProjectName = story.Project.ProjectName,
                UserName = story.User.UserName,
                Category = story.Project.Category.ToString(),


            };
        }

        public async Task<IEnumerable<SuccessStoryDto>> GetByUserNameAsync(string username)
        {
            var user = await _repository.GetByUserAsync(username);
            if (user == null) return Enumerable.Empty<SuccessStoryDto>();

            var stories = await _repository.GetByUserIdAsync(user.Id);
            return stories.Select(s => new SuccessStoryDto
            {
                Id = s.Id,
                UserImage = s.User.Image,
                Description = s.Description,
                ProjectName = s.Project.ProjectName,
                UserName = s.User.UserName,
                Category = s.Project.Category.ToString(),

            }).ToList();
        }

        public async Task<IEnumerable<SuccessStoryDto>> GetRandomStoriesAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var stories = await _repository.GetRandomStoriesAsync(10);
            return stories.Select(s => new SuccessStoryDto
            {
                Id = s.Id,
                UserImage = string.IsNullOrEmpty(s.User.Image)
                    ? null
                    : $"{baseUrl}/images/{s.User.Image}",
                Description = s.Description,
                ProjectName = s.Project.ProjectName,
                UserName = s.User.UserName,
                Name=s.User.Name,
                Category = s.Project.Category.ToString()
            });
        }



        public async Task<IEnumerable<SuccessStoryDto>> GetPendingAddSuccessStoryAsync()
        {
            var stories = await _repository.GetPendingAddSuccessStoryAsync();

            return stories.Select(s => new SuccessStoryDto
            {
                Id = s.Id,
                Description = s.Description,
                UserName = s.User.UserName,
                UserImage = s.User.Image,
                ProjectName = s.Project.ProjectName,
                Category = s.Project.Category.ToString(),


            });
        }

        public async Task<bool> AcceptSuccessStoryAsync(AcceptDto acceptDto)
        {
            var story = await _repository.GetByIdAsync(acceptDto.Id);
            if (story == null)
                throw new Exception("Success Story Not Found");

            story.IsActive = true;
            await _repository.UpdateAsync(story);
            return true;
        }

        public async Task<bool> RejectSuccessStoryAsync(AcceptDto acceptDto)
        {
            var story = await _repository.GetByIdAsync(acceptDto.Id);
            if (story == null)
                throw new Exception("Success Story Not Found");

            await _repository.Delete(story);
            return true;
        }
    }

}


