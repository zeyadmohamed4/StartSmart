using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.Design;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StartUP.Data.Entity
{
    public class Project
    {
        public int Id { get; set; }
        [Index(IsUnique = true)]
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
        public string FundingRoundType { get; set; }
        public decimal TotalFundingRecieved { get; set; }
        public int CompanyAge { get; set; }
        public string Funding_Source { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Budget { get; set; }
        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        // العلاقات
        public SuccessStory? SuccessStory { get; set; }
        public ICollection<Investment> Investments { get; set; }

        public Category Category { get; set; }

        public bool IsActive { get; set; } = false;
        public ProjectDetails ProjectDetails { get; set; }

        // Foreign key
        
        public FundingDetails FundingDetails { get; set; }


        public int? CompanyDealId { get; set; } // ForeignKey
        [ForeignKey(nameof(CompanyDealId))]
        public CampaignDeal CompanyDeal { get; set; }
     



    }
}
