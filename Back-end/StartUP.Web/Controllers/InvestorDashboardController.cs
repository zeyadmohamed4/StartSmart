using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.Dashboards;
using StartUP.Service.InvestmentService;


namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestorDashboardController : ControllerBase
    {
        private readonly IInvestmentService _investmentService;

        public InvestorDashboardController(IInvestmentService investmentService)
        {
            _investmentService = investmentService;
        }


        [HttpGet("ROI/{username}")]
        public async Task<IActionResult> GetRoiByUsername(string username)
        {
            var roi = await _investmentService.CalculateRoiByUsernameAsync(username);
            return Ok(roi);
        }


        [HttpGet("Avg.AnnualGrowthPercentage/{username}")]
        public async Task<IActionResult> GetAvgAnnualGrowth(string username)
        {
            var avgGrowth = await _investmentService.CalculateAverageAnnualGrowthAsync(username);
            return Ok(avgGrowth);
        }


        [HttpGet("MostFundedCategories/{username}")]
        public async Task<IActionResult> GetMostFundedCategories(string username)
        {
            var mostFundedCategories = await _investmentService.GetMostFundedCategoriesAsync(username);

            if (mostFundedCategories == null || mostFundedCategories.Count == 0)
            {
                return NotFound("No investments found for the given username.");
            }

            return Ok(mostFundedCategories);
        }


        [HttpGet("TotalDividendsEarned/{username}")]
        public async Task<IActionResult> GetTotalDividendsEarned(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Username is required.");
            }

            var totalDividends = await _investmentService.CalculateTotalDividendsEarnedAsync(username);

            if (totalDividends == 0)
            {
                return NotFound("No dividends found for the given username.");
            }

            return Ok(new { TotalDividendsEarned = totalDividends });
        }


        [HttpGet("investor-growth/{username}")]
        public async Task<IActionResult> GetInvestorGrowthReport(string username)
        {
            var result = await _investmentService.GetInvestorNetRevenueByMonthAsyncForInvestorAsync(username);
            return Ok(result);
        }


        [HttpGet("Revenue-Distrubtion/{username}")]                     //retuen each project investment with its ROI
        public async Task<IActionResult> GetInvestmentsWithRoi(string username)
        {
            var investments = await _investmentService.GetProjectRoiListByInvestorAsync(username);
            return Ok(investments);
        }



        [HttpGet("projects-Growth_OverTime/{investorUserName}")]
        public async Task<IActionResult> GetProjectsWithNetRevenue(string investorUserName)
        {
            var result = await _investmentService.GetProjectsWithNetRevenueByInvestorMonthlyAsync(investorUserName);
            return Ok(result);
        }


    }
}
