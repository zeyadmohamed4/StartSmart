using System;
using System.Text.Json.Serialization;

namespace StartUP.Service.Dtos.Prediction
{
    public class TotalFundingRecievedDto
    {
        [JsonPropertyName("TotalFundingRounds")]
        public int TotalFundingRounds { get; set; }

        [JsonPropertyName("TotalMilestones")]
        public int TotalMilestones { get; set; }

        [JsonPropertyName("TotalPartenerships")]
        public int TotalPartenerships { get; set; }

        [JsonPropertyName("NoOfInvestors")]
        public int NoOfInvestors { get; set; }

        [JsonPropertyName("FundingAmount")]
        public decimal FundingAmount { get; set; }

        [JsonPropertyName("FundAmountRaised")]
        public decimal FundAmountRaised { get; set; }

        [JsonPropertyName("FoundingYear")]
        public int FoundingYear { get; set; }

        [JsonPropertyName("FundingYear")]
        public int FundingYear { get; set; }

        [JsonPropertyName("FundingFundYear")]
        public int FundingFundYear { get; set; }

        [JsonPropertyName("AverageFundingPerRound")]
        public decimal AverageFundingPerRound { get; set; }

        [JsonPropertyName("time_to_first_funding")]
        public double TimeToFirstFunding { get; set; }

        [JsonPropertyName("Category_encoder")]
        public int CategoryEncoder { get; set; }

        [JsonPropertyName("Status_encoder")]
        public int StatusEncoder { get; set; }

        [JsonPropertyName("FundingRoundType_encoder")]
        public int FundingRoundTypeEncoder { get; set; }
    }
}
