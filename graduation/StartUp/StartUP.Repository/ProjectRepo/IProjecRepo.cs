using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace StartUP.Repository.ProjectRepo
{
    public interface IProjecRepo
    {
        Task<IEnumerable<Project>> GetAllAsync();
        Task<Project> GetByIdAsync(int id);
        Task<IEnumerable<Project>> GetRandomProjectAsync(int count);
        Task<IEnumerable<Project>> GetByUserIdAsync(int id);
        Task<bool> AddAsync(Project Project);
        Task<bool> UpdateAsync(Project project);
        //Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(int id);
        Task Delete(Project project);

        Task<IEnumerable<Project>> GetPendingProjects();
        Task<User> GetUserAsync(string username);
        Task<IEnumerable<Project>> SearchAsync(string query);
        Task<IEnumerable<Project>> SearchCategory(string query);
        Task <int> GetTotalProject();
        Task<int> GetProjectCountAsync(DateTime from, DateTime to);
      //  Task<IEnumerable<Investment>> GetInvestmentsByProjectIdAsync(int projectId);

        Task<int> GetTotalProjectsByOwnerUserNameAsync(string ownerUserName);     //returun count of projects for this owner username

        Task<IEnumerable<Project>> GetProjectsByOwnerAsync(string ownerUserName);    //returun all projects data for this owner username

        Task<Dictionary<string, int>> GetProjectsCountByCountryAsync();              //return count of projects in each country

        Task SaveChangesAsync();

        Task<decimal> GetTotalInvestmentForProjectAsync(int projectId);
        Task<bool> ProjectNameExistsAsync(string projectName);
        Task<int> GetNumberOfInvestorsAsync(int projectId);
        Task<string?> GetLatestInvestmentStatusAsync(int projectId);
        Task<CampaignDeal?> GetDealType(string dealType);
        Task<Investment> GetInvestment (int projectId,int userId);
        Task<Investment> GetInvestmentId(int projectId);
        Task<FundingDetails> GetFundingDetailsAsync(int projectId);
        Task<Project> GetByIdWithInvestmentsAndUsersAsync(int id);
    }
}
