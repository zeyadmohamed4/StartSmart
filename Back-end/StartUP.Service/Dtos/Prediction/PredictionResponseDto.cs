using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Prediction
{
    public class PredictionResponseDto
    {
        public decimal TotalInvestment { get; set; }
        public string NextRoundType { get; set; }
        public decimal NextRoundFunding { get; set; }
    }
}
