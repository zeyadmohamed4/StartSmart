using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Project
{
    public class ProjectDtoResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string ProjectName { get; set; }
        public int TotalFundingRounds { get; set; }
        public int TotalMilestones { get; set; }
        public int MileStoneYear { get; set; }
        public int TotalPartenerships { get; set; }
        public decimal FundingAmount { get; set; }
        public int NoOfInvestors { get; set; }
        public decimal FundAmountRaised { get; set; }
        public int FoundingYear { get; set; }
        public int FundingYear { get; set; }
        public int FundingFundYear { get; set; }
        public decimal AverageFundingPerRound { get; set; }
        public DateTime FirstFundedAt { get; set; }
        public string Location { get; set; }
        public string Country { get; set; }
        public DateTime IsActiveTill { get; set; }
        public string Status { get; set; }
        public string CampaignDealType { get; set; }
        public string FundingRoundType { get; set; }
        public decimal TotalFundingRecieved { get; set; }
        public int CompanyAge { get; set; }
        public string Funding_Source { get; set; }
        public decimal Budget { get; set; }
        public string? Photo { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Category { get; set; }
        public string? InvestmentStatus { get; set; }
        public string? ProjectDetails { get; set; }
    }
}
