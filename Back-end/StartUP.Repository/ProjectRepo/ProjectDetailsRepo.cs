using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System.Threading.Tasks;

namespace StartUP.Repository.ProjectRepo
{
    public class ProjectDetailsRepo : IProjectDetailsRepo
    {
        private readonly StartUPContext _context;

        public ProjectDetailsRepo(StartUPContext context)
        {
            _context = context;
        }

        public async Task<ProjectDetails> GetByIdAsync(int id)
        {
            // تأكد من استخدام Include لتحميل الكائنات المرتبطة
            return await _context.ProjectDetails
                                 .FirstOrDefaultAsync(p => p.ProjectId == id);  // التأكد من أن الـ ProjectDetails الذي تم العثور عليه ليس null
        }

        public async Task<FundingDetails> GetByIdFAsync(int id)
        {
            return await _context.fundingDetails
                                 .FirstOrDefaultAsync(p => p.ProjectId == id);  // التأكد من أن الـ ProjectDetails الذي تم العثور عليه ليس null
        }
        


        public async Task AddAsync(ProjectDetails projectDetails)
        {
            await _context.ProjectDetails.AddAsync(projectDetails);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProjectDetails projectDetails)
        {
            _context.ProjectDetails.Update(projectDetails);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var projectDetails = await GetByIdAsync(id);
            if (projectDetails != null)
            {
                _context.ProjectDetails.Remove(projectDetails);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<ProjectDetails>> GetPendingProjectsDetails()
        {
            return await _context.ProjectDetails
                                 .Where(p => p.IsPending)
                                 .ToListAsync();
        }

        public async Task UpdateAllAsync(ProjectDetails entity)
        {
            _context.ProjectDetails.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
