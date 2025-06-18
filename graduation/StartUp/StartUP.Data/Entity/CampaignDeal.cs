using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class CampaignDeal
    {
        public int Id { get; set; }

        [Required]
        public string DealType { get; set; }

        [Required]
        public string RiskTolerance { get; set; }

        [Required]
        public string InvestmentHorizon { get; set; }

        [Required]
        public string IncomePreference { get; set; }

        [Required]
        public string RepaymentTerms { get; set; }

        public decimal? OwnershipOffered { get; set; }
        public DateTime? MaturityDate { get; set; }
        public decimal? ValuationCap { get; set; }
        public decimal? DiscountRate { get; set; }
        public string? RepaymentCap { get; set; }
        public string? Colletral { get; set; }
        public string? ConversionTrigger { get; set; }

        
     

    }
}

