using StartUP.Data.Entity;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.Dtos.Project;
using StartUP.Service.UserService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.ProjectService
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDtoResponse>> GetAllAsync();
        Task<ProjectDtoResponse> GetByIdAsync(int id);
        Task<IEnumerable<ProjectRandomDto>> GetRandomProjectAsync(int count);
        Task<IEnumerable<ProjectDtoResponse>> GetByUserNameAsync(string username);
        Task<int> AddAsync(ProjectDtoResponse projectDto, string username);
        Task<bool> UpdateAsync(int id, ProjectDtoResponse projectDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ProjectDtoResponse>> GetPendingProjectsAsync();
        Task<bool> AcceptProject(AcceptDto acceptprojectDto);
        Task<bool> RejectProject(AcceptDto acceptprojectDto);
        Task<IEnumerable<ProjectSearchDto>> SearchProjectsAsync(string query);
        Task<IEnumerable<ProjectDtoResponse>> SearchCategoryAsync(string query);
        Task<int> GetTotalProject();
        Task<double> GetWeeklyGrowthPercentageAsync();
        Task<IEnumerable<ProjectCategoryDto>> GetAllProjectsAsync();

        Task<ProjectCategoryDto> GetProjectByIdAsync(int id);



        Task<int> GetTotalProjectsByOwnerUserNameAsync(string ownerUserName);
        Task<IEnumerable<ProjectRevenueDto>> GetProjectsWithRevenueByOwnerAsync(string ownerUserName);
        Task<IEnumerable<CategoryRevenueDto>> GetTotalRevenueByCategoryForOwnerAsync(string ownerUserName);
        Task<IEnumerable<MonthGrowthDto>> GetProjectGrowthLast12MonthsAsyncForOwnerAsync(string ownerUserName);
        Task<Dictionary<string, int>> GetProjectsCountByCountryAsync();
        Task<IEnumerable<ProjectWithFundingInfoDto>> GetProjectsWithFundingInfoAsync();

    }
}