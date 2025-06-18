using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Dashboards
{
    public class InvestorDashboardDto
    {
        // العائد على الاستثمار (Return on Investment)
        public decimal RoiPercentage { get; set; }

        // متوسط معدل نمو الاستثمار السنوي (Average Annual Investment Growth)
        public decimal AverageAnnualGrowthPercentage { get; set; }

        // القطاع اللي حصل على أكبر تمويل (Most Funded Sector)
        public string MostFundedSector { get; set; }

        // إجمالي الأرباح من التوزيعات (Total Dividends Earned)
        public decimal TotalDividendsEarned { get; set; }
    }

    public class InvestorMonthGrowthDto       // for last chart in owner dashboard
    {
        public string Month { get; set; }
        public decimal NetRevenue { get; set; }
    }

    public class RevenueDistrubtionDTO
    {
        public string ProjectName { get; set; }
        public decimal ROI { get; set; }
    }
    public class MonthlyProjectNetRevenueDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<ProjectNetRevenueDto> Projects { get; set; }
    }
    public class ProjectNetRevenueDto
    {
        public string ProjectName { get; set; }
        public decimal NetRevenue { get; set; }


    }


}
