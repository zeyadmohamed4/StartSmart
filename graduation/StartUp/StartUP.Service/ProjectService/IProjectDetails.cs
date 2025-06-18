using StartUP.Data.Entity;
using StartUP.Service.Dtos.Project;
using StartUP.Service.ProjectDetailsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.ProjectService
{
    public interface IProjectDetails 
    {
        Task<IEnumerable<ProjectDetailsResponseDto>> GetAllPendingAsync();
        Task<ProjectDetailsIDDto> GetByIdAsync(int id);
        Task AddAsync(ProjectDetailsRequestDto project);
        Task DeleteAsync(int id);
        Task UpdateAsync(int id, CampaignStoryDto dto);
        Task UpdateProjectDetailsAsync(int id, ProjectDetailsUpdateDto dto);
    }
}
