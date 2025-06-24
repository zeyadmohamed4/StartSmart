using System;
using System.Text.Json.Serialization;

namespace StartUP.Service.Dtos.Prediction
{
    public class ProjectStatusDto
    {
        [JsonPropertyName("TotalFundingRecieved")]
        public decimal TotalFundingRecieved { get; set; }

        [JsonPropertyName("FundingAmount")]
        public decimal FundingAmount { get; set; }

        [JsonPropertyName("TotalFundingRounds")]
        public int TotalFundingRounds { get; set; }

        [JsonPropertyName("TotalMilestones")]
        public int TotalMilestones { get; set; }

        [JsonPropertyName("TotalPartenerships")]
        public int TotalPartenerships { get; set; }

        [JsonPropertyName("NoOfInvestors")]
        public int NoOfInvestors { get; set; }

        [JsonPropertyName("FoundingYear")]
        public int FoundingYear { get; set; }

        [JsonPropertyName("FundingYear")]
        public int FundingYear { get; set; }

        [JsonPropertyName("MileStoneYear")]
        public int MileStoneYear { get; set; }

        [JsonPropertyName("AverageFundingPerRound")]
        public decimal AverageFundingPerRound { get; set; }

        [JsonPropertyName("time_to_first_funding")]
        public double TimeToFirstFunding { get; set; }

        [JsonPropertyName("Category_encoder")]
        public int CategoryEncoder { get; set; }

        [JsonPropertyName("IsActiveTill_year")]
        public int IsActiveTillYear { get; set; }
    }
}
