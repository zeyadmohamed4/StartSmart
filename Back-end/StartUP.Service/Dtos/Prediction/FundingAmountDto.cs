using System;
using System.Text.Json.Serialization;

namespace StartUP.Service.Dtos.Prediction
{
    public class FundingAmountDto
    {
        [JsonPropertyName("TotalFundingRecieved")]
        public decimal TotalFundingRecieved { get; set; }

        [JsonPropertyName("TotalFundingRounds")]
        public int TotalFundingRounds { get; set; }

        [JsonPropertyName("TotalMilestones")]
        public int TotalMilestones { get; set; }

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

        [JsonPropertyName("Country_encoder")]
        public int CountryEncoder { get; set; }

        [JsonPropertyName("FundingRoundType_encoder")]
        public int FundingRoundTypeEncoder { get; set; }
    }
}
