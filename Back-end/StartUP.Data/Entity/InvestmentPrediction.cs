using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class InvestmentPrediction
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        public virtual Project Project { get; set; }

        public decimal InvestmentAmount { get; set; } 
        public string StatusAfterInvestment { get; set; } 
        public DateTime CreatedAt { get; set; }
    }

}
