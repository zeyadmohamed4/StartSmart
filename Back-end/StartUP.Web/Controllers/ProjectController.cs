using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.Project;
using StartUP.Service.ProjectService;
using StartUP.Service.UserService;
using System.Security.Claims;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<ProjectDtoResponse>>> GetAllAsync()
        {
            var project = await _projectService.GetAllAsync();
            return Ok(project);

        }

        [HttpGet("GetRandom")]
        public async Task<ActionResult<IEnumerable<ProjectDtoResponse>>> GetRandomAsync()
        {
            var project = await _projectService.GetRandomProjectAsync(8);
            return Ok(project);

        }

        [HttpGet("GetById/{id}")]
        public async Task<ActionResult<ProjectDtoResponse>> GetById(int id)
        {
            var project = await _projectService.GetByIdAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }


        [HttpGet("GetByUserName")]
        public async Task<ActionResult<IEnumerable<ProjectDtoRequest>>> GetByUserName()
        {
            var username = User.Identity?.Name;
            var project = await _projectService.GetByUserNameAsync(username);
            return Ok(project);

        }
        [HttpPost("Create")]
        public async Task<ActionResult> Create(ProjectDtoResponse projectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var username = User.Identity?.Name;

            var isSuccess = await _projectService.AddAsync(projectDto, username);
            if (isSuccess == 0)
                return BadRequest("Error while creating the project");


            return Ok(new
            {
                projectId = isSuccess,
                massege = "Project created successfully"
            });
        }
        [HttpPut("Update/{id}")]
        public async Task<ActionResult> Update(int id, ProjectDtoResponse projectDto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);



            var isSuccess = await _projectService.UpdateAsync(id, projectDto);
            if (!isSuccess)
                return NotFound();

            return Ok("Project updated successfully");
        }

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var isSuccess = await _projectService.DeleteAsync(id);
            if (!isSuccess)
                return NotFound();

            return Ok("Project deleted successfully");
        }

        [HttpGet("GetPendingProjects")]
        public async Task<IActionResult> GetPendingProjects()
        {
            var projects = await _projectService.GetPendingProjectsAsync();
            return Ok(projects);

        }

        [HttpPost("AcceptProject")]
        public async Task<IActionResult> AcceptProject(AcceptDto acceptProjectDto)
        {
            var user = await _projectService.AcceptProject(acceptProjectDto);
            return Ok("Project Accepted successfully.");
        }

        [HttpPost("DeleteProject")]
        public async Task<IActionResult> DeleteProject(AcceptDto acceptProjectDto)
        {
            var user = await _projectService.RejectProject(acceptProjectDto);
            return Ok("Project Recjected successfully.");
        }


        [HttpGet("Search")]
        public async Task<IActionResult> SearchProject([FromQuery] ProjectQueryDTo projectQueryDTo)
        {
            if (string.IsNullOrWhiteSpace(projectQueryDTo.Query))
                return BadRequest("Search Query cannot be empty");

            var projects = await _projectService.SearchProjectsAsync(projectQueryDTo.Query);

            if (projects == null || !projects.Any())
                return NotFound("No Projects Found");

            return Ok(projects);
        }
        [HttpGet("Category")]
        public async Task<IActionResult> SearchCategory([FromQuery] ProjectQueryDTo projectQueryDTo)
        {
            if (string.IsNullOrWhiteSpace(projectQueryDTo.Query))
                return BadRequest("Search Query cannot be empty");

            var category = await _projectService.SearchCategoryAsync(projectQueryDTo.Query);

            if (category == null || !category.Any())
                return NotFound("No Category Found");

            return Ok(category);
        }



        [HttpGet("GetTotalProject")]
        public async Task<ActionResult> GetTotalProject()
        {
            var project = await _projectService.GetTotalProject();

            var growth = await _projectService.GetWeeklyGrowthPercentageAsync();
            return Ok(new
            {
                project,
                growthPercentage = Math.Round(growth, 2)
            });

        }

        [HttpGet("GetAllCategoryCards")]
        public async Task<ActionResult<IEnumerable<ProjectCategoryDto>>> GetAllCategoryAsync()
        {
         
            var project = await _projectService.GetAllProjectsAsync();
            return Ok(project);

        }

        [HttpGet("GetCategoryByIdInPD")]//بتاع صفحه الماشييييييين
        public async Task<ActionResult<ProjectCategoryIdDto>> GetProjectById(int id)
        {

            var project = await _projectService.GetProjectByIdAsync(id);

            if (project == null)
            {
                return NotFound("Project Not Found");
            }

            return Ok(project);
        }


        [HttpGet("total-projects/{ownerUserName}")]
        public async Task<IActionResult> GetTotalProjectsForOwner(string ownerUserName)
        {
            var totalProjects = await _projectService.GetTotalProjectsByOwnerUserNameAsync(ownerUserName);
            return Ok(totalProjects);
        }

    }
}

