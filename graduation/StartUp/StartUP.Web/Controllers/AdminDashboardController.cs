using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.InvestmentService;
using StartUP.Service.ProjectService;
using StartUP.Service.UserService;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IInvestmentService _investmentService;
        private readonly IUserServicecs _userService;

        public AdminDashboardController(IProjectService projectService, IInvestmentService investmentService, IUserServicecs userService)
        {
            _projectService = projectService;
            _investmentService = investmentService;
            _userService = userService;
        }


        [HttpGet("total-projects")]
        public async Task<ActionResult<int>> GetTotalProjects()
        {
            var totalProjects = await _projectService.GetTotalProject();
            return Ok(totalProjects);
        }


        [HttpGet("total-investments")]
        public async Task<ActionResult<int>> GetTotalInvestments()
        {
            var totalInvestments = await _investmentService.GetTotalInvestmentsAsync();
            return Ok(totalInvestments); 
        }

        [HttpGet("total-revenue")]
        public async Task<ActionResult<decimal>> GetTotalRevenue()
        { 
            var totalRevenue = await _investmentService.GetTotalRevenueAsync();
            return Ok(totalRevenue);  
        }

        [HttpGet("user-growth")]
        public async Task<ActionResult<int>> GetUserGrowth()
        {
            var totalUsers = await _userService.GetTotalUsersAsync();
            return Ok(totalUsers);
        }


        [HttpGet("projects-by-country")]
        public async Task<ActionResult<Dictionary<string, int>>> GetProjectsCountByCountry()
        {
            var projectsByCountry = await _projectService.GetProjectsCountByCountryAsync();
            return Ok(projectsByCountry);
        }


        [HttpGet("total-owners-investors")]
        public async Task<ActionResult<object>> GetOwnersAndInvestorsCount()
        {
            var (ownersCount, investorsCount) = await _userService.GetOwnersAndInvestorsCountAsync();
            return Ok(new
            {
                OwnersCount = ownersCount,
                InvestorsCount = investorsCount
            });
        }

        [HttpGet("projects-funding-info")]
        public async Task<ActionResult<IEnumerable<ProjectWithFundingInfoDto>>> GetProjectsWithFundingInfo()
        {
            var projects = await _projectService.GetProjectsWithFundingInfoAsync();
            return Ok(projects);
        }



    }
        
}
