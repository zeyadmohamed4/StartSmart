using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Project
{
    public class ProjectCategoryIdDto
    {
        public string Photo { get; set; }
        public string ProjectName { get; set; }
        public string Location { get; set; }
        public string Country { get; set; }
        public decimal Progress { get; set; }
        public int NumberOfInvestors { get; set; }
        public string RaisedOfWhat { get; set; }
        public int DaysLeft { get; set; }
        public string Status { get; set; }
        public string CampaignDealType { get; set; }
        public decimal MinimumInvestment { get; set; }
        public decimal MaximumInvestment { get; set; }
        public decimal Goal { get; set; }
        public string InvestmentStatus { get; set; }
        //Goal 
    }
}
