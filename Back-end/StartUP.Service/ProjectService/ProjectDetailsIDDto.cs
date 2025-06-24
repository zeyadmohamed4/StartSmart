namespace StartUP.Service.ProjectDetailsService
{
    public class ProjectDetailsIDDto
    {

        public string Website { get; set; }
        public string ContactEmail { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Milestones { get; set; }
        public string CompanyPhoto { get; set; }
        public string? CampaignStory { get; set; }
        public string ProjectName { get; set; }
        public DateTime IsActiveTill { get; set; }
        public int DaysLeft { get; set; }
        public int NumberOfInvestment { get; set; }
        public int FoundingYear { get; set; }
        public string Location { get; set; }
        public int TotalFundingRounds { get; set; }
        public string FundingRoundType { get; set; }
        public int UserId { get; set; }

    }
}