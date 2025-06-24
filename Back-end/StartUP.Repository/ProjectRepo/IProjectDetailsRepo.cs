using System.Threading.Tasks;
using StartUP.Data.Entity;

namespace StartUP.Repository.ProjectRepo
{
    public interface IProjectDetailsRepo
    {
        Task<ProjectDetails> GetByIdAsync(int id);
        Task AddAsync(ProjectDetails projectDetails);
        Task<FundingDetails> GetByIdFAsync(int id);
        Task UpdateAsync(ProjectDetails projectDetails);
        Task UpdateAllAsync(ProjectDetails entity);

        Task DeleteAsync(int id);
        Task<IEnumerable<ProjectDetails>> GetPendingProjectsDetails();

    }
}
