using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using StartUP.Service;
using StartUP.Service.InvestmentService;
using StartUP.Service.ProjectService;
using StartUP.Service.Dtos.Dashboards;

namespace StartUP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnerDashboardController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IInvestmentService _investmentService;

        public OwnerDashboardController(IProjectService projectService,IInvestmentService investmentService)
        {
            _projectService = projectService;
            _investmentService = investmentService;
        }

        [HttpGet("total-projects/{ownerUserName}")]
        public async Task<IActionResult> GetTotalProjects(string ownerUserName)
        {
            var total = await _projectService.GetTotalProjectsByOwnerUserNameAsync(ownerUserName);
            return Ok(total);
        }

        [HttpGet("total-investments/{ownerUserName}")]
        public async Task<IActionResult> GetTotalInvestments(string ownerUserName)
        {
            var total = await _investmentService.GetTotalInvestmentsByOwnerUserNameAsync(ownerUserName);
            return Ok(total);
        }

        [HttpGet("total-revenue/{ownerUserName}")]
        public async Task<IActionResult> GetTotalRevenue(string ownerUserName)
        {
            var total = await _investmentService.GetTotalRevenueByOwnerUserNameAsync(ownerUserName);
            return Ok(total);
        }

        [HttpGet("investors-Growth/{ownerUserName}")]
        public async Task<IActionResult> GetTotalInvestors(string ownerUserName)
        {
            var total = await _investmentService.GetInvestorCountByOwnerUserNameAsync(ownerUserName);
            return Ok(total);
        }

      

        [HttpGet("projectsBudget-with-revenue/{ownerUserName}")]              //returun project name and budget and total revenue  for first chart in owner dashboard
        public async Task<IActionResult> GetProjectsBudgetWithRevenue(string ownerUserName)
        {
            var projectsWithRevenue = await _projectService.GetProjectsWithRevenueByOwnerAsync(ownerUserName);
            return Ok(projectsWithRevenue);
        }

         
        [HttpGet("projectsCategory-total-revenue/{ownerUserName}")]                    // return project name and budget+total revenue for middle chart in owner dashboard
        public async Task<IActionResult> GetProjectsTotalRevenue(string ownerUserName)
        {
            var result = await _projectService.GetTotalRevenueByCategoryForOwnerAsync(ownerUserName);
            return Ok(result);
        }

        [HttpGet("project-growth-12months/{ownerUserName}")]                   // return total budgets and total revenues for all projects in every month 
        public async Task<IActionResult> GetProjectGrowth12Months(string ownerUserName)
        {
            var data = await _projectService.GetProjectGrowthLast12MonthsAsyncForOwnerAsync(ownerUserName);
            return Ok(data);
        }

        [HttpGet("summary/{ownerUserName}")]  // Summary data
        public async Task<IActionResult> GetOwnerDashboardSummary(string ownerUserName)
        {
            // استرجاع جميع البيانات المطلوبة
            var totalProjects = await _projectService.GetTotalProjectsByOwnerUserNameAsync(ownerUserName);
            var totalInvestments = await _investmentService.GetTotalInvestmentsByOwnerUserNameAsync(ownerUserName);
            var investorsGrowth = await _investmentService.GetInvestorCountByOwnerUserNameAsync(ownerUserName);
            var totalRevenue = await _investmentService.GetTotalRevenueByOwnerUserNameAsync(ownerUserName);

            // استرجاع المشاريع مع الإيرادات
            var projectsWithRevenue = await _projectService.GetProjectsWithRevenueByOwnerAsync(ownerUserName);

            // استرجاع نمو المشاريع خلال آخر 12 شهر
            var projectGrowthLast12Months = await _projectService.GetProjectGrowthLast12MonthsAsyncForOwnerAsync(ownerUserName);

            // استرجاع إجمالي الإيرادات لجميع المشاريع
            var projectsTotalRevenue = await _projectService.GetTotalRevenueByCategoryForOwnerAsync(ownerUserName);
            
            // تجميع النتائج في DTO
            var summary = new summary
            {
                TotalProjects = totalProjects,
                TotalInvestments = totalInvestments,
                TotalRevenue = totalRevenue,
                InvestorsGrowth = investorsGrowth,
                ProjectsWithRevenue = projectsWithRevenue,
                ProjectGrowthLast12Months = projectGrowthLast12Months,
                projectsTotalRevenue = projectsTotalRevenue
            };

            return Ok(summary);
        }



    }
}
