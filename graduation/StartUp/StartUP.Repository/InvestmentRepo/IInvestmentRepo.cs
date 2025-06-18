using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository.InvestmentRepo
{
    public interface IInvestmentRepo
    {
        Task<bool> AddAsync(Investment investment);
        Task<bool> UpdateAsync(Investment investment);
        Task<bool> DeleteAsync(int id);
        Task Delete(Investment investment);

        Task<IEnumerable<Investment>> GetAllAsync();
        Task<IEnumerable<Investment>> GetAllPendingAsync();

        Task<Investment> GetByIdAsync(int id);                                            // return investment by id
        Task<List<Investment>> GetInvestmentsByUsernameAsync(string InvestorUserName);    // return investment by InvestorUserName


        Task<Project> GetByProjectNameAsync(string name);

        Task<Project> GetByProjectIdAsync(int id);

        Task<int> GetInvestorCountByOwnerUserNameAsync(string ownerUserName);

        Task<int> GetTotalInvestmentsByOwnerUserNameAsync(string ownerUserName);

        Task<decimal> GetTotalRevenueByOwnerUserNameAsync(string ownerUserName);

        Task<User> GetByUserId(int userId);
        Task<int> GetTotalInvestmentsAsync();
        Task<decimal> GetTotalRevenueAsync();

        Task<Investment> GetInvestment(int projectId, int userId);
        Task<bool> AddContract(Investment investment);
        Task<bool> AddPayment(Investment investment);
        Task<Investment> GetByProjectAndUserAsync(int projectId, int userId);


        Task<bool> HasInvestmentsAsync(int userId);
        Task<List<int>> GetInvestorsByProjectIdAsync(int projectId);
    }
}
