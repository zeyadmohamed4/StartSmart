using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Repository
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetNonReadNotificationsByUserIdAsync(int userId);
        Task<IEnumerable<Notification>> GetReadNotificationsByUserIdAsync(int userId);
        Task AddAsync(Notification notification);
      
        Task DeleteAsync(int notificationId);
        Task MarkAllAsReadAsync(int userId);  // New method to mark all as read
        Task<Notification> GetByIdAsync(int notificationId);
        Task UpdateAsync(Notification notification);
        Task UpdateRangeAsync(IEnumerable<Notification> notifications);  // Update multiple notifications at once
        Task<List<Notification>> GetAllNotificationsByUserIdAsync(int userId);
        Task DeleteRangeAsync(List<Notification> notifications);
        

    }
}
