using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Prediction
{
    public class PredictionResultsDto
    {
        public string FundingRoundType { get; set; }
        public decimal TotalFundingRecieved { get; set; }
        public decimal FundingAmount { get; set; }

    }
}
