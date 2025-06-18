using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Contract
{
    public class ContractDto
    {
        public string InvestorName { get; set; }
        public string ProjectName { get; set; }
        public string RiskTolerance { get; set; }
        public string InvestmentHorizon { get; set; }
        public string IncomePreference { get; set; }
        public string RepaymentTerms { get; set; }
        public decimal? OwnershipOffered { get; set; }
    }

}
