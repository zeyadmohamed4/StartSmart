namespace StartUP.Service
{
    public class NotificationDTO
    {
        public int Id { get; set; }
        public int? SenderID { get; set; }                    // لو محتاج الـ ID كمان
        public string? SenderName { get; set; }
        public string? SenderPhoto { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectId { get; set; }
        public string Message { get; set; }
        public string? FullMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsUnread { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }

        public int InvestmentId { get; set; }

        // Extra investment details
        public string? CampaignDealType { get; set; }
        public string? InvestorName { get; set; }
        public string? InvestmentStatus { get; set; }
        public decimal? InvestmentAmount { get; set; }
        public decimal? MinInvest { get; set; }
        public decimal? MaxInvest { get; set; }
    }


}