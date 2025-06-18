using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Dashboards
{

    public class summary
    {
        public int TotalProjects { get; set; }
        public int TotalInvestments { get; set; }
        public decimal TotalRevenue { get; set; }
        public int InvestorsGrowth { get; set; }
        public IEnumerable<ProjectRevenueDto> ProjectsWithRevenue { get; set; }
        public IEnumerable<MonthGrowthDto> ProjectGrowthLast12Months { get; set; }
        public IEnumerable<CategoryRevenueDto> projectsTotalRevenue { get; set; }
    }

    public class OwnerDashboardDto                 // for 4 cards in owner dashboard
    {
        public int TotalProjects { get; set; }
        public int TotalInvestments { get; set; }
        public int InvestorsGrowth { get; set; }
        public decimal TotalRevenue { get; set; }

    }

    public class ProjectRevenueDto           // for first chart in owner dashboard
    {
        public string ProjectName { get; set; }
        public decimal Budget { get; set; }
        public decimal TotalRevenue { get; set; }

    }

    public class CategoryRevenueDto
    {
        public string Category { get; set; }
        public decimal TotalRevenue { get; set; }

    }

    public class MonthGrowthDto       // for last chart in owner dashboard
    {
        public string Month { get; set; }
        public decimal NetRevenue { get; set; }
    }


}

