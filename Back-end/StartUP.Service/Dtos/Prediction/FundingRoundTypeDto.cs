using System;
using System.Text.Json.Serialization;

namespace StartUP.Service.Dtos.Prediction
{
    public class FundingRoundTypeDto
    {
        [JsonPropertyName("TotalFundingRecieved")]
        public decimal TotalFundingRecieved { get; set; }

        [JsonPropertyName("TotalFundingRounds")]
        public int TotalFundingRounds { get; set; }

        [JsonPropertyName("TotalPartenerships")]
        public int TotalPartenerships { get; set; }

        [JsonPropertyName("NoOfInvestors")]
        public int NoOfInvestors { get; set; }

        [JsonPropertyName("FundingAmount")]
        public decimal FundingAmount { get; set; }

        [JsonPropertyName("FoundingYear")]
        public int FoundingYear { get; set; }

        [JsonPropertyName("FundingYear")]
        public int FundingYear { get; set; }

        [JsonPropertyName("CompanyAge")]
        public double CompanyAge { get; set; }

        [JsonPropertyName("AverageFundingPerRound")]
        public decimal AverageFundingPerRound { get; set; }

        [JsonPropertyName("time_to_first_funding")]
        public double TimeToFirstFunding { get; set; }

        [JsonPropertyName("Category_encoder")]
        public int CategoryEncoder { get; set; }

        [JsonPropertyName("Status_encoder")]
        public int StatusEncoder { get; set; }
    }
}
