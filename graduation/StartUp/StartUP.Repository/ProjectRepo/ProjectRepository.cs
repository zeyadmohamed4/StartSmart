using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.ProjectRepo
{
    public class ProjectRepository : IProjecRepo
    {
        private readonly StartUPContext _context;

        public ProjectRepository(StartUPContext context)
        {
            _context = context;
        }
        public async Task<bool> AddAsync(Project Project)
        {
            await _context.Projects.AddAsync(Project);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _context.Projects
                .Include(p => p.SuccessStory)
                .Include(p => p.ProjectDetails)
                .Include(p => p.Investments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return false;

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 🧹 حذف Notifications المرتبطة بالمشروع
                var notifications = await _context.Notifications
                    .Where(n => n.ProjectId == id)
                    .ToListAsync();

                if (notifications.Any())
                {
                    _context.Notifications.RemoveRange(notifications);
                }

                // حذف SuccessStory إذا كانت موجودة
                if (project.SuccessStory != null)
                {
                    _context.SuccessStories.Remove(project.SuccessStory);
                }

                // حذف ProjectDetails إذا كانت موجودة
                if (project.ProjectDetails != null)
                {
                    _context.ProjectDetails.Remove(project.ProjectDetails);
                }

                // حذف الاستثمارات المرتبطة
                if (project.Investments != null && project.Investments.Any())
                {
                    _context.Investments.RemoveRange(project.Investments);
                }

                // حذف المشروع نفسه
                _context.Projects.Remove(project);

                // حفظ التغييرات
                var result = await _context.SaveChangesAsync() > 0;
                await transaction.CommitAsync();

                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            return await _context.Projects.Include(s => s.User).Include(p => p.FundingDetails).Include(p => p.ProjectDetails).Include(p => p.CompanyDeal).ToListAsync();
        }

        public async Task<Project> GetByIdAsync(int id)
        {
            return await _context.Projects.Include(s => s.User).Include(s => s.FundingDetails).Include(s => s.ProjectDetails).Include(s => s.CompanyDeal).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Project>> GetByUserIdAsync(int id)
        {
            return await _context.Projects
                .Where(p => p.UserId == id)
                .Include(p => p.CompanyDeal)
                .Include(p => p.ProjectDetails) // تأكد من تضمين ProjectDetails
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetRandomProjectAsync(int count)
        {
            return await _context.Projects.Include(s => s.User).Include(s => s.ProjectDetails)
           .OrderBy(r => Guid.NewGuid())
           .Take(count)
           .ToListAsync();

        }

        public async Task<bool> UpdateAsync(Project project)
        {

            _context.Update(project);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<User> GetUserAsync(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        }

        public async Task<IEnumerable<Project>> GetPendingProjects()
        {
            return await _context.Projects.Include(s => s.User).Include(s => s.CompanyDeal).Include(s => s.ProjectDetails).Where(p => p.IsActive == false).ToListAsync();
        }

        public async Task Delete(Project project)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<Project>> SearchAsync(string query)
        {
            return await _context.Projects
                .Where(p => p.ProjectName.Contains(query))
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> SearchCategory(string query)
        {
            return await _context.Projects
                .Include(p => p.User).Include(p => p.CompanyDeal).Include(p => p.FundingDetails)
                .Where(p => p.Category.ToString().ToLower().Contains(query.ToLower()))
                .ToListAsync();
        }

        public async Task<int> GetTotalProject()
        {
            return await _context.Projects.CountAsync();
        }

        public async Task<int> GetProjectCountAsync(DateTime from, DateTime to)
        {
            return await _context.Projects
                .Where(p => p.CreatedAt >= from && p.CreatedAt < to)
                .CountAsync();
        }

        //public async Task<IEnumerable<FundingDetails>> GetInvestmentsByProjectIdAsync(int projectId)
        //{
        //    return await _context.Projects.Where(i=>i)
        //}

        public async Task<int> GetTotalProjectsByOwnerUserNameAsync(string ownerUserName)
        {
            return await _context.Projects
                .Where(p => p.User.UserName == ownerUserName && p.User.Role.ToLower() == "owner")
                .CountAsync();
        }

        public List<Project> GetProjectsByOwnerUsername(string username)
        {
            return _context.Projects
                .Include(p => p.Investments)
                .Include(p => p.User)
                .Where(p => p.User.UserName == username)
                .ToList();
        }

        public async Task<IEnumerable<Project>> GetProjectsByOwnerAsync(string ownerUserName)
        {
            // التحقق أولاً هل يوجد مستخدم owner بهذا الاسم
            var ownerExists = await _context.Users
                .AnyAsync(u => u.UserName == ownerUserName && u.Role.ToLower() == "owner");

            if (!ownerExists)
            {
                throw new Exception($"There is no owner named : '{ownerUserName}'");
            }

            // جلب المشاريع الخاصة به
            return await _context.Projects
                .Where(p => p.User.UserName == ownerUserName && p.User.Role.ToLower() == "owner")
                .Include(p => p.Investments).ThenInclude(i => i.User)
                .ToListAsync();
        }


        public async Task<Dictionary<string, int>> GetProjectsCountByCountryAsync()
        {
            var projectCounts = await _context.Set<Project>()
                                               .GroupBy(p => p.Country)
                                               .Select(g => new { Country = g.Key, Count = g.Count() })
                                               .ToListAsync();

            // تحويل النتيجة إلى قاموس Dictionary
            return projectCounts.ToDictionary(x => x.Country, x => x.Count);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<decimal> GetTotalInvestmentForProjectAsync(int projectId)
        {
            return await _context.Investments
                .Where(i => i.ProjectId == projectId && i.IsActive)
                .SumAsync(i => i.InvestmentAmount);
        }

        public async Task<bool> ProjectNameExistsAsync(string projectName)
        {
            return await _context.Projects.AnyAsync(p => p.ProjectName == projectName);
        }

        public async Task<int> GetNumberOfInvestorsAsync(int projectId)
        {
            return await _context.Investments
                .Where(i => i.ProjectId == projectId && i.IsActive)
                .Select(i => i.UserId)
                .Distinct()
                .CountAsync();
        }

        public async Task<string?> GetLatestInvestmentStatusAsync(int projectId)
        {
            return await _context.InvestmentPrediction
                .Where(p => p.ProjectId == projectId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => p.StatusAfterInvestment)
                .FirstOrDefaultAsync();
        }

        public async Task<CampaignDeal?> GetDealType(string dealType)
        {
            return await _context.CampaignDeals
            .FirstOrDefaultAsync(c => c.DealType == dealType);
        }

        public async Task<Investment> GetInvestment(int projectId, int userId)
        {
            return await _context.Investments
                .FirstOrDefaultAsync(i => i.UserId == userId && i.ProjectId == projectId);
        }
        public async Task<Investment> GetInvestmentId(int projectId)
        {
            return await _context.Investments.Include(u=>u.User)
                .FirstOrDefaultAsync(i => i.ProjectId == projectId);
        }

        public async Task<FundingDetails> GetFundingDetailsAsync(int projectId)
        {
            return await _context.fundingDetails.FirstOrDefaultAsync(p => p.ProjectId == projectId);
        }

        public async Task<Project> GetByIdWithInvestmentsAndUsersAsync(int id)
        {
            return await _context.Projects
                .Include(p => p.Investments)
                    .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }


    }
}
