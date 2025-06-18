using System;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Project;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Investment
{
    public class InvestmentResponseDto
    {
        public int Id { get; set; }
        public decimal InvestmentAmount { get; set; }
        public string ProjectName { get; set; }
        public string InvestorName { get; set; }
        public decimal? EquityPercentage { get; set; }
        public decimal? InterestRate { get; set; }
        public decimal? RevenueShare { get; set; }
        public decimal Revenue { get; set; }       ///check
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public string? ProjectDetails { get; set; }
        public string Category { get; set; }
        public bool? CompletePayment { get; set; } 

    }
}
