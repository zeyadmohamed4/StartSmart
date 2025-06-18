using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Investment
{
    public class investmentPending
    {
        public int Id {  get; set; }
        public string InvestorName { get; set; }
        public string ProjectName { get; set; }
        public decimal Amount { get; set; }
        public string InvestmentHorizon { get; set; }
        public decimal InterestRate { get; set; }
        public string IncomePreference { get; set; }
        public string RiskTolerance { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }


    }
}
