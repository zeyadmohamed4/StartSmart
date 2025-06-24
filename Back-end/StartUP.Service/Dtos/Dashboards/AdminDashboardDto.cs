using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Dashboards
{
    public class AdminDashboardDto
    {
        public int TotalProjects { get; set; }
        public int TotalInvestments { get; set; }
        public decimal TotalRevenue { get; set; }
        public int UserGrowth { get; set; }

    }

    public class ProjectWithFundingInfoDto
    {
        public string ProjectName { get; set; }
        public decimal Budget { get; set; }
        public decimal TotalFundingRecieved { get; set; }
    }
}
