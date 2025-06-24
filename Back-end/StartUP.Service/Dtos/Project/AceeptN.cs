using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Project
{
    public class AceeptN
    {
        public string ProjectName { get; set; }
        public string CampaignDealType { get; set; }
        public string InvestorName { get; set; }
        public string InvestmentStatus { get; set; }
        public decimal InvestmentAmount { get; set; }
        public int ProjectId { get; set; }
        public decimal MinInvest { get; set; }
        public decimal MaxInvest { get; set; }
    }
}
