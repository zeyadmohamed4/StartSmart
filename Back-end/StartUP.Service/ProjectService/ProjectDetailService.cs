using StartUP.Repository.ProjectRepo;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Project;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StartUP.Service.ProjectService;
using Microsoft.AspNetCore.Http;
using StartUP.Service.Dtos.User;

namespace StartUP.Service.ProjectDetailsService
{
    public class ProjectDetailsService : IProjectDetails
    {
        private readonly IProjectDetailsRepo _repo;

        private readonly IProjecRepo _projecRepo;

        private readonly IHttpContextAccessor _httpContextAccessor;


        public ProjectDetailsService(IProjectDetailsRepo repo , IProjecRepo projecRepo, IHttpContextAccessor httpContextAccessor)
        {
            _repo = repo;
            _projecRepo = projecRepo;
            _httpContextAccessor = httpContextAccessor;

        }

        public async Task<IEnumerable<ProjectDetailsResponseDto>> GetAllPendingAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var data = await _repo.GetPendingProjectsDetails();

            // Manual mapping
            return data.Select(d => new ProjectDetailsResponseDto
            {
                Website = d.Website,
                ContactEmail = d.ContactEmail,
                Address = d.Address,
                Description = d.Description,
                Milestones = d.Milestones,
                CompanyPhoto = string.IsNullOrEmpty(d.CompanyPhoto) ? null : $"{baseUrl}/images/{d.CompanyPhoto}",
                CampaignStory = d.CampaignStory
            });
        }

        public async Task<ProjectDetailsIDDto> GetByIdAsync(int id)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var projectdetails = await _repo.GetByIdAsync(id);
            var fundingdetails = await _repo.GetByIdFAsync(id);
            var project = await _projecRepo.GetByIdAsync(id);

            // التحقق من أن المشروع ليس null وأنه يحتوي على FundingDetails
            if (projectdetails == null || fundingdetails == null)
                return null;  // إذا لم يكن هناك تمويل تفاصيل، نعيد null

            int numberOfInvestors = await _projecRepo.GetNumberOfInvestorsAsync(id);

            return new ProjectDetailsIDDto
            {
                Website = projectdetails.Website,
                ContactEmail = projectdetails.ContactEmail,
                Address = projectdetails.Address,
                Description = projectdetails.Description,
                Milestones = projectdetails.Milestones,
                CompanyPhoto = string.IsNullOrEmpty(projectdetails.CompanyPhoto) ? null : $"{baseUrl}/images/{projectdetails.CompanyPhoto}"?? "",
                CampaignStory = projectdetails.CampaignStory,
                ProjectName = project.ProjectName,
                IsActiveTill = project.IsActiveTill,
                DaysLeft =  (project.FundingDetails.EndDate - DateTime.UtcNow).Days,
                NumberOfInvestment = numberOfInvestors,
                FoundingYear = project.FoundingYear,
                Location = project.Location,
                TotalFundingRounds = project.TotalFundingRounds,
                FundingRoundType = project.FundingRoundType,
                UserId = project.UserId,

            };
        }

        public async Task AddAsync(ProjectDetailsRequestDto dto)
        {
            // حفظ الصورة في مجلد داخل المشروع
            string imageName = null;
            if (dto.CompanyPhoto != null && dto.CompanyPhoto.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder); // يتأكد إن المجلد موجود
                imageName = Guid.NewGuid().ToString() + Path.GetExtension(dto.CompanyPhoto.FileName);
                var filePath = Path.Combine(uploadsFolder, imageName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.CompanyPhoto.CopyToAsync(stream);
                }
            }
            var entity = new ProjectDetails
            {
                Website = dto.Website,
                ContactEmail = dto.ContactEmail,
                Address = dto.Address,
                Description = dto.Description,
                Milestones = dto.Milestones,
                CompanyPhoto = imageName,
                CampaignStory = dto.CampaignStory,
                IsPending = true,
                ProjectId = dto.ProjectId,
            };

            await _repo.AddAsync(entity);
        }

        public async Task UpdateAsync(int id, CampaignStoryDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity != null)
            {
                entity.CampaignStory = dto.CampaignStory;
                await _repo.UpdateAsync(entity);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity != null)
            {
                entity.CampaignStory = null;
                await _repo.UpdateAsync(entity);
            }
        }
        public async Task UpdateProjectDetailsAsync(int id, ProjectDetailsUpdateDto dto)
        {
            // حفظ الصورة في مجلد داخل المشروع
            string? imageName = null;
            if (dto.CompanyPhoto != null && dto.CompanyPhoto.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder); // يتأكد إن المجلد موجود
                imageName = Guid.NewGuid().ToString() + Path.GetExtension(dto.CompanyPhoto.FileName);
                var filePath = Path.Combine(uploadsFolder, imageName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.CompanyPhoto.CopyToAsync(stream);
                }
            }
            var entity = await _repo.GetByIdAsync(id);
            if (entity != null)
            {
                entity.Website = dto.Website;
                entity.ContactEmail = dto.ContactEmail;
                entity.Address = dto.Address;
                entity.Description = dto.Description;
                entity.Milestones = dto.Milestones;
                entity.CompanyPhoto = imageName;

                await _repo.UpdateAsync(entity);
            }
        }
    }
}

