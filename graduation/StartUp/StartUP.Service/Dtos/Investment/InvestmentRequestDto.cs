using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StartUP.Service.Dtos.Investment
{
    public class InvestmentRequestDto
    {
        public int Id { get; set; }
        public decimal InvestmentAmount { get; set; }
        public string ProjectName { get; set; }
        public decimal? EquityPercentage { get; set; }
        public decimal? InterestRate { get; set; }
        public decimal? RevenueShare { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Revenue { get; set; }       ///check
        public DateTime Date { get; set; }

    }
}
