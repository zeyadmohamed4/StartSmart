using AutoMapper;
using Microsoft.AspNetCore.Http;
using StartUP.Data.Entity;
using StartUP.Data.Migrations;
using StartUP.Repository.ProjectRepo;
using StartUP.Repository.UserRepo;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.Dtos.Investment;
using StartUP.Service.Dtos.Project;
using StartUP.Repository.InvestmentRepo;
using StartUP.Service.FeedBackService;
using StartUP.Service.InvestmentService;
using StartUP.Service.UserService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using StartUP.Repository;

namespace StartUP.Service.ProjectService
{
    public class ProjectService : IProjectService
    {
        private readonly IProjecRepo _projecRepo;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IInvestmentRepo _investRepo;
        private readonly IUserRepo _userRepo;
        private readonly INotificationRepository _notificationRepo;

        public ProjectService(
            IProjecRepo projecRepo,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IInvestmentRepo investRepo,
            IUserRepo userRepo,
            INotificationRepository notificationRepo)
        {
            _projecRepo = projecRepo;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _investRepo = investRepo;
            _userRepo = userRepo;
            _notificationRepo = notificationRepo;
        }

        public async Task<IEnumerable<ProjectDtoResponse>> GetAllAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var projects = await _projecRepo.GetAllAsync();

            var result = projects.Select(p => new ProjectDtoResponse
            {
                UserName = p.User.UserName,
                ProjectName = p.ProjectName,
                TotalFundingRounds = p.TotalFundingRounds,
                TotalMilestones = p.TotalMilestones,
                MileStoneYear = p.MileStoneYear,
                TotalPartenerships = p.TotalPartenerships,
                FundingAmount = p.FundingAmount,
                NoOfInvestors = p.NoOfInvestors,
                FundAmountRaised = p.FundAmountRaised,
                FoundingYear = p.FoundingYear,
                FundingYear = p.FundingYear,
                FundingFundYear = p.FundingFundYear,
                AverageFundingPerRound = p.AverageFundingPerRound,
                FirstFundedAt = p.FirstFundedAt,
                Location = p.Location,
                Country = p.Country,
                IsActiveTill = p.IsActiveTill,
                Status = p.Status,
                CampaignDealType = p.CompanyDeal.DealType,
                FundingRoundType = p.FundingRoundType,
                TotalFundingRecieved = p.TotalFundingRecieved,
                CompanyAge = p.CompanyAge,
                Funding_Source = p.Funding_Source,
                Budget = p.Budget,
                Photo = string.IsNullOrEmpty(p.ProjectDetails.CompanyPhoto ?? "") ? null : $"{baseUrl}/images/{p.ProjectDetails.CompanyPhoto ?? ""}",
                CreatedAt = p.CreatedAt,
                Category = p.Category.ToString(),
            });

            return result;
        }


        public async Task<ProjectDtoResponse> GetByIdAsync(int id)
        {
            var project = await _projecRepo.GetByIdAsync(id);
            return _mapper.Map<ProjectDtoResponse>(project);
        }

        public async Task<int> AddAsync(ProjectDtoResponse projectDto, string username)
        {
            var user = await _projecRepo.GetUserAsync(username);
            if (user == null)
                throw new Exception("User not found");
            var dealType = await _projecRepo.GetDealType(projectDto.CampaignDealType);

            bool projectExists = await _projecRepo.ProjectNameExistsAsync(projectDto.ProjectName);
            if (projectExists)
                throw new Exception($"Project name '{projectDto.ProjectName}' is already taken.");

            var project = new Project
            {
                UserId = user.Id,
                Category = Enum.Parse<Category>(projectDto.Category),
                ProjectName = projectDto.ProjectName,
                TotalFundingRounds = projectDto.TotalFundingRounds,
                TotalMilestones = projectDto.TotalMilestones,
                MileStoneYear = projectDto.MileStoneYear,
                TotalPartenerships = projectDto.TotalPartenerships,
                FundingAmount = projectDto.FundingAmount,
                NoOfInvestors = projectDto.NoOfInvestors,
                FundAmountRaised = projectDto.FundAmountRaised,
                FoundingYear = projectDto.FoundingYear,
                FundingYear = projectDto.FundingYear,
                FundingFundYear = projectDto.FundingFundYear,
                AverageFundingPerRound = projectDto.AverageFundingPerRound,
                FirstFundedAt = projectDto.FirstFundedAt,
                Location = projectDto.Location,
                Country = projectDto.Country,
                IsActiveTill = projectDto.IsActiveTill,
                Status = projectDto.Status,
                FundingRoundType = projectDto.FundingRoundType,
                TotalFundingRecieved = projectDto.TotalFundingRecieved,
                CompanyAge = projectDto.CompanyAge,
                Funding_Source = projectDto.Funding_Source,
                Budget = projectDto.Budget,
                CreatedAt = projectDto.CreatedAt,
                CompanyDealId = dealType.Id,
            };

            if (!await _projecRepo.AddAsync(project)) return 0;

            return project.Id;
        }

        public async Task<bool> UpdateAsync(int id, ProjectDtoResponse projectDto)
        {
            var project = await _projecRepo.GetByIdAsync(id);
            if (project == null)
                return false;

            var user = await _projecRepo.GetUserAsync(projectDto.UserName);
            if (user == null)
                throw new Exception("User not found");

            _mapper.Map(projectDto, project);
            project.UserId = user.Id;

            return await _projecRepo.UpdateAsync(project);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var senderId = GetCurrentUserId();

            // 1. نجيب المشروع ونتأكد إنه موجود
            var project = await _projecRepo.GetByIdAsync(id);
            if (project == null)
                return false;

            var projectName = project.ProjectName;

            // 2. نجيب كل المستثمرين قبل حذف المشروع
            var investors = await _investRepo.GetInvestorsByProjectIdAsync(id); // افترضنا بيرجع List<int>

            // 3. نحذف المشروع الأول
            var deleteSuccess = await _projecRepo.DeleteAsync(id);
            if (!deleteSuccess)
                return false;

            // 4. بعد الحذف، نبعِت نوتيفيكيشنز لكل المستثمرين
            foreach (var investorId in investors.Distinct())
            {
                await CreateAndSendNotification(senderId, investorId, null, projectName); // 👈 ProjectId = null
            }

            return true;
        }


        private async Task CreateAndSendNotification(int senderId, int receiverId, int? projectId, string projectName)
        {
            var notification = new Notification
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                ProjectId = projectId, // 👈 nullable
                Message = $"Project '{projectName}' has been deleted",
                FullMessage = $"Your investment in project '{projectName}' has been cancelled",
                Type = "ProjectDeletion",
                Status = "Cancelled",
                CreatedAt = DateTime.UtcNow,
                IsUnread = true
            };

            await _notificationRepo.AddAsync(notification);
        }


        private int GetCurrentUserId()
        {
            var claim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user ID");
            }
            return userId;
        }


        public async Task<IEnumerable<ProjectRandomDto>> GetRandomProjectAsync(int count)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
 

            var projects = await _projecRepo.GetRandomProjectAsync(count);
            return projects.Select(p => new ProjectRandomDto
            {
                Id = p.Id,
                ProjectName = p.ProjectName,
                Description = p.ProjectDetails?.Description ?? string.Empty,
                Category = p.Category.ToString(),
                Image = string.IsNullOrEmpty(p.ProjectDetails.CompanyPhoto ?? "") ? null : $"{baseUrl}/images/{p.ProjectDetails.CompanyPhoto ?? ""}",
            });
        }


        public async Task<IEnumerable<ProjectDtoResponse>> GetByUserNameAsync(string username)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var user = await _projecRepo.GetUserAsync(username);
            if (user == null)
                throw new Exception("User not found");

            var projects = await _projecRepo.GetByUserIdAsync(user.Id);

            var result = new List<ProjectDtoResponse>();

            foreach (var p in projects)
            {
                var investment = await _investRepo.GetByProjectAndUserAsync(p.Id, user.Id);

                result.Add(new ProjectDtoResponse
                {
                    Id = p.Id,
                    UserName = user.UserName,
                    ProjectName = p.ProjectName,
                    TotalFundingRounds = p.TotalFundingRounds,
                    TotalMilestones = p.TotalMilestones,
                    MileStoneYear = p.MileStoneYear,
                    TotalPartenerships = p.TotalPartenerships,
                    FundingAmount = p.FundingAmount,
                    NoOfInvestors = p.NoOfInvestors,
                    FundAmountRaised = p.FundAmountRaised,
                    FoundingYear = p.FoundingYear,
                    FundingYear = p.FundingYear,
                    FundingFundYear = p.FundingFundYear,
                    AverageFundingPerRound = p.AverageFundingPerRound,
                    FirstFundedAt = p.FirstFundedAt,
                    Location = p.Location,
                    Country = p.Country,
                    IsActiveTill = p.IsActiveTill,
                    Status = p.Status,
                    CampaignDealType = p.CompanyDeal?.DealType ?? "N/A",
                    FundingRoundType = p.FundingRoundType,
                    TotalFundingRecieved = p.TotalFundingRecieved,
                    CompanyAge = p.CompanyAge,
                    Funding_Source = p.Funding_Source,
                    Budget = p.Budget,
                    Photo = GetProjectPhotoUrl(p.ProjectDetails?.CompanyPhoto, baseUrl),
                    CreatedAt = p.CreatedAt,
                    Category = p.Category.ToString() ?? "N/A",
                    InvestmentStatus = investment?.InvestmentStatus ?? "Not Invested",
                    ProjectDetails = p.ProjectDetails?.Description
                });
            }

            return result;
        }

        private string GetProjectPhotoUrl(string companyPhoto, string baseUrl)
        {
            return string.IsNullOrEmpty(companyPhoto)
                ? null
                : $"{baseUrl}/images/{companyPhoto}";
        }

        public async Task<IEnumerable<ProjectDtoResponse>> GetPendingProjectsAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var projects = await _projecRepo.GetPendingProjects();
            var result = projects?.Select(p => new ProjectDtoResponse
            {
                Id= p.Id,
                UserName = p.User.UserName,
                ProjectName = p.ProjectName,
                TotalFundingRounds = p.TotalFundingRounds,
                TotalMilestones = p.TotalMilestones,
                MileStoneYear = p.MileStoneYear,
                TotalPartenerships = p.TotalPartenerships,
                FundingAmount = p.FundingAmount,
                NoOfInvestors = p.NoOfInvestors,
                FundAmountRaised = p.FundAmountRaised,
                FoundingYear = p.FoundingYear,
                FundingYear = p.FundingYear,
                FundingFundYear = p.FundingFundYear,
                AverageFundingPerRound = p.AverageFundingPerRound,
                FirstFundedAt = p.FirstFundedAt,
                Location = p.Location,
                Country = p.Country,
                IsActiveTill = p.IsActiveTill,
                Status = p.Status,
                CampaignDealType = p.CompanyDeal.DealType,
                FundingRoundType = p.FundingRoundType,
                TotalFundingRecieved = p.TotalFundingRecieved,
                CompanyAge = p.CompanyAge,
                Funding_Source = p.Funding_Source,
                Budget = p.Budget,
                Photo = string.IsNullOrEmpty(p.ProjectDetails?.CompanyPhoto)
                        ? $"{baseUrl}/images/default.jpg"
                        : $"{baseUrl}/images/{p.ProjectDetails.CompanyPhoto}",
                CreatedAt = p.CreatedAt,
                Category = p.Category.ToString(),
            });

            return result;
        }

        public async Task<bool> AcceptProject(AcceptDto acceptProjectDto)
        {
            var project = await _projecRepo.GetByIdAsync(acceptProjectDto.Id);
            if (project == null)
                throw new Exception("Project Not Found");

            project.IsActive = true;
            await _projecRepo.UpdateAsync(project);
            return true;
        }

        public async Task<bool> RejectProject(AcceptDto acceptProjectDto)
        {
            var project = await _projecRepo.GetByIdAsync(acceptProjectDto.Id);
            if (project == null)
                throw new Exception("Project Not Found");

            await _projecRepo.Delete(project);
            return true;
        }

        public async Task<IEnumerable<ProjectSearchDto>> SearchProjectsAsync(string query)
        {
            var projects = await _projecRepo.SearchAsync(query);

            return projects
                .Where(p => p.ProjectName.Contains(query, StringComparison.OrdinalIgnoreCase))
                .Select(p => new ProjectSearchDto
                {
                    Id = p.Id,
                    ProjectName = p.ProjectName,

                });
        }



        public async Task<IEnumerable<ProjectDtoResponse>> SearchCategoryAsync(string query)
        {
            var projects = await _projecRepo.SearchCategory(query);
            return projects
                .Where(p => p.Category.ToString().Contains(query, StringComparison.OrdinalIgnoreCase))
                .Select(p => _mapper.Map<ProjectDtoResponse>(p));
        }

        public async Task<int> GetTotalProject()
        {
            var total = await _projecRepo.GetTotalProject();
            return total;
        }

        public async Task<double> GetWeeklyGrowthPercentageAsync()
        {
            var today = DateTime.UtcNow.Date;
            var startOfThisWeek = today.AddDays(-(int)today.DayOfWeek);
            var startOfLastWeek = startOfThisWeek.AddDays(-7);
            var endOfLastWeek = startOfThisWeek;
            var endOfThisWeek = today.AddDays(1);

            var thisWeekCount = await _projecRepo.GetProjectCountAsync(startOfThisWeek, endOfThisWeek);
            var lastWeekCount = await _projecRepo.GetProjectCountAsync(startOfLastWeek, endOfLastWeek);

            if (lastWeekCount == 0)
                return thisWeekCount > 0 ? 100 : 0;

            double growth = ((double)(thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
            return growth;
        }


        public async Task<IEnumerable<ProjectCategoryDto>> GetAllProjectsAsync()
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var projects = await _projecRepo.GetAllAsync();

            int? userId = null;

            // جرب تقرأ الـ userId من التوكن (لو موجود)
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedId))
            {
                userId = parsedId;
            }

            var result = new List<ProjectCategoryDto>();

            foreach (var p in projects)
            {
                // التأكد من وجود FundingDetails قبل الاستمرار
                if (p.FundingDetails == null)
                {
                    continue; // يمكنك تعديل هذا السطر لتجاهل الخطأ أو التعامل معه بطريقة أخرى
                }

                decimal investmentAmount = 0;
                string investmentStatus = "Invest";
                string investorName = null;
                int investmentId = 0;

                if (userId.HasValue)
                {
                    var investment = await _projecRepo.GetInvestment(p.Id, userId.Value);
                    var invest = await _projecRepo.GetInvestmentId(p.Id);

                    investmentStatus = investment?.InvestmentStatus ?? "Invest";
                    investorName = invest?.User?.Name ?? "No User";
                    investmentId = invest?.Id ?? 0;
                    investmentAmount = invest?.InvestmentAmount ?? 0;
                }

                decimal totalInvested = await _projecRepo.GetTotalInvestmentForProjectAsync(p.Id);
                decimal progress = 0;

                if (p.FundingDetails.TotalInvestment > 0)
                {
                    progress = Math.Round((totalInvested / p.FundingDetails.TotalInvestment) * 100, 2);
                }

                decimal minInvestment = await CalculateMinimumInvestmentAsync(p.Id);
                decimal maxInvestment = await CalculateMaximumInvestmentAsync(p.Id);

                var daysLeft = (p.FundingDetails.EndDate - DateTime.UtcNow).Days;

                int numberOfInvestors = await _projecRepo.GetNumberOfInvestorsAsync(p.Id) + p.NoOfInvestors;

                string raisedOfWhat = p.FundingDetails.TotalInvestment > 0
                    ? $"{totalInvested} of {p.FundingDetails.TotalInvestment}"
                    : "No funding target set";

                result.Add(new ProjectCategoryDto
                {
                    Id = p.Id,
                    Photo = string.IsNullOrEmpty(p.ProjectDetails?.CompanyPhoto)
                        ? $"{baseUrl}/images/default.jpg"
                        : $"{baseUrl}/images/{p.ProjectDetails.CompanyPhoto}",

                    ProjectName = p.ProjectName,
                    Location = p.Location,
                    Country = p.Country,
                    Progress = progress,
                    NumberOfInvestors = numberOfInvestors,
                    RaisedOfWhat = raisedOfWhat,
                    DaysLeft = daysLeft,
                    CampaignDealType = p.CompanyDeal?.DealType ?? "N/A",
                    MinInvestment = minInvestment,
                    MaxInvestment = maxInvestment,
                    Goal = p.FundingDetails.TotalInvestment,
                    Category = p.Category.ToString(),
                    CategoryId = (int)p.Category,
                    InvestmentStatus = investmentStatus,
                    InvestmentId = investmentId,
                    InvestorName = investorName,
                    InvestmentAmount = investmentAmount
                });
            }

            return result;
        }


        public async Task<ProjectCategoryDto> GetProjectByIdAsync(int id)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";

            var project = await _projecRepo.GetByIdAsync(id);
            if (project == null)
            {
                return null;
            }

            // قراءة userId من التوكن إن وجد
            int? userId = null;

            // جرب تقرأ الـ userId من التوكن (لو موجود)
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedId))
            {
                userId = parsedId;
            }

            // حساب نسبة التقدم
            decimal totalInvested = await _projecRepo.GetTotalInvestmentForProjectAsync(project.Id);
            decimal progress = 0;
            if (project.FundingDetails?.TotalInvestment > 0)
            {
                progress = Math.Round((totalInvested / project.FundingDetails.TotalInvestment) * 100, 2);
            }

            // معلومات الاستثمار للمستخدم (إن وجد)
            string investmentStatus = "Invest";
          

            if (userId.HasValue)
            {
                var investment = await _projecRepo.GetInvestment(project.Id, userId.Value);
                investmentStatus = investment?.InvestmentStatus ?? "Invest";

            }
            string investorName = "No User";
            int investmentId = 0;
            decimal investmentAmount = 0;
            var invest = await _projecRepo.GetInvestmentId(project.Id);

            investorName = invest?.User?.Name ?? "No User";
            investmentId = invest?.Id ?? 0;
            investmentAmount = invest?.InvestmentAmount ?? 0;

            var daysLeft = (project.FundingDetails.EndDate - DateTime.UtcNow).Days;
            decimal minInvestment = await CalculateMinimumInvestmentAsync(id);
            decimal maxInvestment = await CalculateMaximumInvestmentAsync(id);
            int numberOfInvestors = await _projecRepo.GetNumberOfInvestorsAsync(project.Id);
         //   string? latestStatus = await _projecRepo.GetLatestInvestmentStatusAsync(project.Id);

            return new ProjectCategoryDto
            {
                UserId = project.User.Id,
                Id = project.Id,
                Photo = string.IsNullOrEmpty(project.ProjectDetails?.CompanyPhoto)
                        ? $"{baseUrl}/images/default.jpg"
                        : $"{baseUrl}/images/{project.ProjectDetails.CompanyPhoto}",
                ProjectName = project.ProjectName,
                Location = project.Location,
                Country = project.Country,
                Progress = progress,
                NumberOfInvestors = numberOfInvestors,
                RaisedOfWhat = $"{totalInvested} of {project.FundingDetails?.TotalInvestment ?? 0}",
                DaysLeft = daysLeft,
                CampaignDealType = project.CompanyDeal?.DealType,
                MinInvestment = minInvestment,
                MaxInvestment = maxInvestment,
                Goal = project.FundingDetails?.TotalInvestment ?? 0,
                Category = project.Category.ToString(),
                CategoryId = (int)project.Category,
                InvestmentStatus = investmentStatus,
                InvestmentId = investmentId,
                InvestorName = investorName,
                InvestmentAmount = investmentAmount,
                Status = project.Status
            };
        }



        private async Task<decimal> CalculateMinimumInvestmentAsync(int projectId)
        {
            var project = await _projecRepo.GetByIdAsync(projectId);

            if (project?.FundingDetails == null)
                throw new InvalidOperationException("Funding details not found for this project.");

            decimal min = project.FundingDetails.NextRoundFunding * 0.15m;
            return min;
        }



        private async Task<decimal> CalculateMaximumInvestmentAsync(int projectId)
        {
            var project = await _projecRepo.GetByIdAsync(projectId);

            if (project?.FundingDetails == null)
                throw new InvalidOperationException("Funding details not found for this project.");

            decimal max = project.FundingDetails.NextRoundFunding * 0.25m;
            return max;
        }


        public async Task<int> GetTotalProjectsByOwnerUserNameAsync(string ownerUserName)
        {
            return await _projecRepo.GetTotalProjectsByOwnerUserNameAsync(ownerUserName);
        }

        public async Task<IEnumerable<ProjectRevenueDto>> GetProjectsWithRevenueByOwnerAsync(string ownerUserName)
        {
            // جلب المشاريع مع الاستثمارات
            var projects = await _projecRepo.GetProjectsByOwnerAsync(ownerUserName);

            // تحويل البيانات إلى ProjectRevenueDto
            var projectRevenueDtos = projects.Select(p => new ProjectRevenueDto
            {
                ProjectName = p.ProjectName,
                Budget = p.Budget,
                TotalRevenue = p.Investments.Sum(i => i.Revenue)
            }).ToList();

            return projectRevenueDtos;
        }
        public async Task<IEnumerable<CategoryRevenueDto>> GetTotalRevenueByCategoryForOwnerAsync(string ownerUserName)
        {
            // جلب المشاريع مع الإيرادات
            var projects = await _projecRepo.GetProjectsByOwnerAsync(ownerUserName);

            // تجميع المشاريع حسب الفئة وحساب إجمالي الإيرادات
            var groupedResult = projects
                .GroupBy(p => Enum.GetName(typeof(Category), p.Category))  // استخدم Name بدلاً من Category
                .Select(g => new CategoryRevenueDto
                {
                    Category = g.Key,  // اسم الفئة
                    TotalRevenue = g.Sum(p => p.Investments.Sum(i => i.Revenue))  // إجمالي الإيرادات لجميع المشاريع في الفئة
                })
                .ToList();

            return groupedResult;
        }




        public async Task<IEnumerable<MonthGrowthDto>> GetProjectGrowthLast12MonthsAsyncForOwnerAsync(string ownerUserName)
        {
            var twelveMonthsAgo = DateTime.Now.AddMonths(-11); // من 11 شهر + الشهر الحالي = 12 شهر
            var startDate = new DateTime(twelveMonthsAgo.Year, twelveMonthsAgo.Month, 1);

            // استرجاع المشاريع الخاصة بالـ owner فقط
            var projects = await _projecRepo.GetProjectsByOwnerAsync(ownerUserName);

            // تصفية المشاريع التي أنشئت في آخر 12 شهر وتجميع الميزانية والإيرادات من الاستثمارات
            var filteredProjects = projects
                .Where(p => p.CreatedAt >= startDate) // تحديد المشاريع التي تم إنشاؤها في آخر 12 شهر
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month }) // تجميع المشاريع حسب الشهر والسنة
                .Select(g =>
                {
                    var totalBudget = g.Sum(p => p.Budget);
                    var totalRevenue = g.Sum(p => p.Investments.Sum(i => i.Revenue));
                    return new MonthGrowthDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"),
                        NetRevenue = totalBudget - totalRevenue
                    };
                })
                .OrderBy(m => DateTime.ParseExact(m.Month, "MMMM", null).Month) // ترتيب النتائج حسب الشهر
                .ToList();

            return filteredProjects;
        }



        public async Task<Dictionary<string, int>> GetProjectsCountByCountryAsync()
        {
            return await _projecRepo.GetProjectsCountByCountryAsync();
        }


        public async Task<IEnumerable<ProjectWithFundingInfoDto>> GetProjectsWithFundingInfoAsync()
        {
            var projects = await _projecRepo.GetAllAsync();

            return projects.Select(p => new ProjectWithFundingInfoDto
            {
                ProjectName = p.ProjectName,
                Budget = p.Budget,
                TotalFundingRecieved = p.TotalFundingRecieved
            }).ToList();
        }


    }
}
