using StartUP.Data.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Investment
{
    [Key]
    public int Id { get; set; }
    public decimal InvestmentAmount { get; set; } 
    public decimal? EquityPercentage { get; set; } 
    public decimal? InterestRate { get; set; } 
    public decimal? RevenueShare { get; set; }
    [Required]
    [Column(TypeName = "decimal(18,4)")]
    public decimal Revenue { get; set; }       ///check

    [Required]
    public int ProjectId { get; set; }

    [ForeignKey(nameof(ProjectId))]
    public virtual Project Project { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public  User User { get; set; }


    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string InvestmentStatus { get; set; } = "Invest";
    public string? Signature { get; set; }
    public string? FullName { get; set; }
    public string? Image { get; set; }
    public string? CardNumber { get; set; }
    public string? CVV { get; set; }
    public string? ExpiryDate { get; set; }
    public string? PaymentMethod { get; set; }
    public bool CompletePayment { get; set; } = false;  



}
