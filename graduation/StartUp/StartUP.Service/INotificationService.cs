using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service
{
    public interface INotificationService
    {

        Task<IEnumerable<NotificationDTO>> GetNonReadNotificationsOwnerAsync(int userId);
        Task<IEnumerable<NotificationDTO>> GetNonReadNotificationsInvestorAsync(int userId);
        Task<IEnumerable<NotificationDTO>> GetReadNotificationsAsyncAsync(int userId);
        Task MarkAsReadAsync(int notificationId);
        Task DeleteAsync(int notificationId);
        Task MarkAllAsReadAsync(int userId);
        Task DeleteAllNotificationsAsync(int userId);
    }
}
