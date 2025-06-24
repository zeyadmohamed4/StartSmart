using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StartUP.Service.ProjectService;

namespace StartUP.Service.InvestmentPredectionService
{
    public class InvestmentPredictionDto
    {
        public int ProjectId { get; set; }
        public decimal InvestmentAmount { get; set; }
        public string StatusAfterInvestment { get; set; }
        public int UserId  { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
