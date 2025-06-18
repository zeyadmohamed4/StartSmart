using StartUP.Data.Entity;
using StartUP.Repository.ProjectRepo;
using StartUP.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StartUP.Service.ProjectService;
using System.Threading.Tasks;
using StartUP.Repository.UserRepo;
using Microsoft.AspNetCore.Http;

namespace StartUP.Service
{


    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly IProjecRepo _projectRepo;
        private readonly IUserRepo _userRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProjectService _projectService;

        public NotificationService(
      INotificationRepository notificationRepo,
      IProjecRepo projectRepo,
      IUserRepo userRepo, IHttpContextAccessor httpContextAccessor, IProjectService projectService)
        {
            _notificationRepo = notificationRepo;
            _projectRepo = projectRepo;
            _userRepo = userRepo;
            _httpContextAccessor = httpContextAccessor;
            _projectService = projectService;
        }

        public async Task<IEnumerable<NotificationDTO>> GetNonReadNotificationsOwnerAsync(int userId)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var notifications = await _notificationRepo.GetAllNotificationsByUserIdAsync(userId);

            var result = new List<NotificationDTO>();

            foreach (var n in notifications)
            {
                Investment? invest = null;

                if (n.ProjectId.HasValue)
                {
                    invest = await _projectRepo.GetInvestment(n.ProjectId.Value, n.SenderId);
                }

                result.Add(new NotificationDTO
                {
                    Id = n.Id,
                    SenderName = n.Sender?.Name,
                    SenderPhoto = string.IsNullOrEmpty(n.Sender?.Image) ? null : $"{baseUrl}/images/{n.Sender.Image}",
                    ProjectName = n.Project?.ProjectName ?? n.ProjectName ?? "Deleted Project",
                    ProjectId = n.ProjectId ?? 0, // ممكن تخليها -1 لو عايز تميز المشاريع المحذوفة
                    Message = n.Message,
                    FullMessage = n.FullMessage?
                        .Replace("\r\n", " ")
                        .Replace("\n", " ")
                        .Replace("\r", " "),
                    CreatedAt = n.CreatedAt,
                    IsUnread = n.IsUnread,
                    Type = n.Type,
                    Status = n.Status,
                    InvestmentId = invest?.Id ?? 0
                });
            }

            return result;
        }


        public async Task<IEnumerable<NotificationDTO>> GetNonReadNotificationsInvestorAsync(int userId)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var notifications = await _notificationRepo.GetAllNotificationsByUserIdAsync(userId);

            var result = new List<NotificationDTO>();

            foreach (var n in notifications)
            {
                Investment? invest = null;
                Project? project = null;

                decimal minInvest = 0;
                decimal maxInvest = 0;

                if (n.ProjectId.HasValue)
                {
                    invest = await _projectRepo.GetInvestment(n.ProjectId.Value, userId);
                    project = await _projectRepo.GetByIdAsync(n.ProjectId.Value);

                    if (project != null)
                    {
                        minInvest = await CalculateMinimumInvestmentAsync(project.Id);
                        maxInvest = await CalculateMaximumInvestmentAsync(project.Id);
                    }
                }

                result.Add(new NotificationDTO
                {
                    Id = n.Id,
                    SenderID = n.Sender?.Id ?? 0,
                    SenderName = n.Sender?.Name,
                    SenderPhoto = string.IsNullOrEmpty(n.Sender?.Image)
                        ? null
                        : $"{baseUrl}/images/{n.Sender.Image}",
                    ProjectName = n.Project?.ProjectName ?? n.ProjectName ?? "Deleted Project",
                    ProjectId = n.ProjectId ?? -1,
                    Message = n.Message,
                    FullMessage = n.FullMessage?
                        .Replace("\r\n", " ")
                        .Replace("\n", " ")
                        .Replace("\r", " "),
                    CreatedAt = n.CreatedAt,
                    IsUnread = n.IsUnread,
                    Type = n.Type,
                    Status = n.Status,
                    InvestmentId = invest?.Id ?? 0,

                    // خصائص الاستثمار
                    CampaignDealType = project?.CompanyDeal?.DealType,
                    InvestorName = invest?.User?.Name,
                    InvestmentStatus = invest?.InvestmentStatus,
                    InvestmentAmount = invest?.InvestmentAmount ?? 0,
                    MinInvest = minInvest,
                    MaxInvest = maxInvest
                });
            }

            return result;
        }





        public async Task<IEnumerable<NotificationDTO>> GetReadNotificationsAsyncAsync(int userId)
        {
            var baseUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
            var notifications = await _notificationRepo.GetReadNotificationsByUserIdAsync(userId);

            return notifications.Select(n => new NotificationDTO
            {

                Id = n.Id,
                SenderName = n.Sender.Name,
                SenderPhoto = string.IsNullOrEmpty(n.Sender.Image)
                    ? null
                    : $"{baseUrl}/images/{n.Sender.Image}",

                ProjectName = n.Project?.ProjectName,
                ProjectId = (int)n.ProjectId,
                Message = n.Message,
                FullMessage = n.FullMessage?
                    .Replace("\r\n", " ")
                    .Replace("\n", " ")
                    .Replace("\r", " "),


                CreatedAt = n.CreatedAt,
                IsUnread = n.IsUnread,
                Type = n.Type,
                Status = n.Status
            });
        }
        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _notificationRepo.GetByIdAsync(notificationId);
            if (notification != null && notification.IsUnread)
            {
                notification.IsUnread = false;
                await _notificationRepo.UpdateAsync(notification);
            }
            else { throw new Exception("Notification Not Found"); }
        }
        public async Task DeleteAsync(int notificationId)
        {
            await _notificationRepo.DeleteAsync(notificationId);
        }
        public async Task MarkAllAsReadAsync(int userId)
        {
            try
            {
                var notifications = await _notificationRepo.GetNonReadNotificationsByUserIdAsync(userId);

                if (notifications == null || !notifications.Any())
                {
                    throw new InvalidOperationException("No unread notifications found for this user.");
                }

                foreach (var notification in notifications.Where(n => n.IsUnread))
                {
                    notification.IsUnread = false;
                }

                await _notificationRepo.UpdateRangeAsync(notifications);
            }
            catch (Exception ex)
            {
                // يمكنك استخدام logger هنا إن عندك logging system
                throw new ApplicationException($"An error occurred while marking notifications as read for user {userId}.", ex);
            }
        }

        public async Task DeleteAllNotificationsAsync(int userId)
        {
            try
            {
                var notifications = await _notificationRepo.GetAllNotificationsByUserIdAsync(userId);

                if (notifications == null || !notifications.Any())
                {
                    throw new InvalidOperationException("No notifications found for this user.");
                }

                await _notificationRepo.DeleteRangeAsync(notifications);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while deleting notifications for user {userId}.", ex);
            }
        }


        private async Task<decimal> CalculateMinimumInvestmentAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project?.FundingDetails == null)
                return 0;

            return project.FundingDetails.NextRoundFunding * 0.15m;
        }

        private async Task<decimal> CalculateMaximumInvestmentAsync(int projectId)
        {
            var project = await _projectRepo.GetByIdAsync(projectId);
            if (project?.FundingDetails == null)
                return 0;

            return project.FundingDetails.NextRoundFunding * 0.25m;
        }

    }
}
    
