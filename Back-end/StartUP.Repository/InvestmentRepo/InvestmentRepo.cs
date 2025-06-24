using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.InvestmentRepo
{
    public class InvestmentRepo : IInvestmentRepo
    {

        private readonly StartUPContext _context;

        public InvestmentRepo(StartUPContext context)
        {
            _context = context;
        }



        public async Task<bool> AddAsync(Investment investment)
        {
            _context.Investments.Add(investment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var investment =  await _context.Investments.FindAsync(id);
            if(investment== null)  return false;
            _context.Investments.Remove(investment);
            return await _context.SaveChangesAsync() >0;
        }

        public async Task<IEnumerable<Investment>> GetAllAsync()
        {
            return await _context.Investments
                .AsNoTracking()
                .Include(s => s.Project)
                    .ThenInclude(p => p.ProjectDetails) // تحميل ProjectDetails مع Project
                .Include(s => s.User)
                .ToListAsync();
        }
        public async Task<Investment> GetByIdAsync(int id)
        {
            return await _context.Investments
                .Include(i => i.Project)
                    .ThenInclude(p => p.User) // صاحب المشروع
                .Include(i => i.User) // المستثمر نفسه
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Project> GetByProjectIdAsync(int id)
        {
            return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Project> GetByProjectNameAsync(string name)
        {
            return await _context.Projects.Include(p=>p.CompanyDeal).FirstOrDefaultAsync(p => p.ProjectName == name);
        }

        public async Task<bool> UpdateAsync(Investment investment)
        {
            _context.Entry(investment).CurrentValues.SetValues(investment);
            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<IEnumerable<Investment>> GetAllPendingAsync()
        {
            return await _context.Investments.AsNoTracking().Include(s => s.Project).ThenInclude(s => s.CompanyDeal).Include(s => s.User).Where(p=> p.IsActive == false ).ToListAsync();
        }

        public async Task Delete(Investment investment)
        {
            _context.Investments.Remove(investment);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetInvestorCountByOwnerUserNameAsync(string ownerUserName)
        {
            return await _context.Investments
                .Where(inv => inv.Project.User.UserName == ownerUserName && inv.Project.User.Role.ToLower() == "owner")
                .Select(inv => inv.UserId)
                .Distinct()
                .CountAsync();
        }

        public async Task<int> GetTotalInvestmentsByOwnerUserNameAsync(string ownerUserName)
        {
            return await _context.Investments
                .Where(inv => inv.Project.User.UserName == ownerUserName && inv.Project.User.Role.ToLower() == "owner")
                .CountAsync();
        }

        public async Task<decimal> GetTotalRevenueByOwnerUserNameAsync(string ownerUserName)
        {
            return await _context.Investments
                .Where(inv => inv.Project.User.UserName == ownerUserName && inv.Project.User.Role.ToLower() == "owner")
                .SumAsync(inv => inv.Revenue);
        }

        public async Task<User> GetByUserId(int userId)
        {

            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        }

        public async Task<int> GetTotalInvestmentsAsync()
        {
            return await _context.Set<Investment>().CountAsync();
        }
        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.Set<Investment>().SumAsync(i => i.Revenue);
        }


        public async Task<List<Investment>> GetInvestmentsByUsernameAsync(string investorUserName)
        {
            // التحقق أولاً هل يوجد مستخدم investor بهذا الاسم
            var investorExists = await _context.Users
                .AnyAsync(u => u.UserName == investorUserName && u.Role.ToLower() == "investor");

            if (!investorExists)
            {
                throw new Exception($"There is no investor named: '{investorUserName}'");
            }

            // استرجاع الاستثمارات الخاصة بالمستثمر
            var investments = await _context.Investments
                .Where(i => i.User.UserName == investorUserName && i.User.Role.ToLower() == "investor")
                .Include(i => i.Project)
                .ToListAsync();

            return investments;
        }

        public async Task<Investment> GetInvestment(int projectId, int userId)
        {
            return await _context.Investments
                .FirstOrDefaultAsync(i => i.UserId == userId && i.ProjectId == projectId);
        }

        public async Task<bool> AddContract(Investment investment)
        {
            _context.Entry(investment).CurrentValues.SetValues(investment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Investment> GetByProjectAndUserAsync(int projectId, int userId)
        {
            return await _context.Investments
                .FirstOrDefaultAsync(i => i.ProjectId == projectId && i.Project.UserId == userId);
        }

        public async Task<bool> AddPayment(Investment investment)
        {
            _context.Entry(investment).CurrentValues.SetValues(investment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> HasInvestmentsAsync(int userId)
        {
            return await _context.Investments.AnyAsync(i => i.UserId == userId);
        }

        public async Task<List<int>> GetInvestorsByProjectIdAsync(int projectId)
        {
            return await _context.Investments
                .Where(i => i.ProjectId == projectId)
                .Select(i => i.UserId) // افترضنا اسم العمود اللي فيه ID المستثمر
                .Distinct()
                .ToListAsync();
        }

    }
}
