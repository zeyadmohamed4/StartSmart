using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class FundingDetails
    {
        public int Id { get; set; } 
        public decimal TotalInvestment { get; set; }
        public string NextRoundType { get; set; }
        public decimal NextRoundFunding { get; set; }
       // public int DaysLeft { get; set; }
        public DateTime EndDate { get; set; } // تاريخ بداية الجولة
        [ForeignKey(nameof(ProjectId))]
        public Project Project { get; set; }
        public int ProjectId { get; set; }


    }
}
