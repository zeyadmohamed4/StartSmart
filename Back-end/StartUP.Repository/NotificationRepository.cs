

using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;

namespace StartUP.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly StartUPContext _context;

        public NotificationRepository(StartUPContext context)
        {
            _context = context;
        }

        // Get all notifications for a specific user
        public async Task<IEnumerable<Notification>> GetNonReadNotificationsByUserIdAsync(int userId)
        {
            return await _context.Notifications.Include(u=>u.Receiver).Include(u=>u.Sender).Include(p=>p.Project)
                .Where(n => n.ReceiverId == userId).Where(n=>n.IsUnread == true)
                .ToListAsync();
        }
        public async Task<IEnumerable<Notification>> GetReadNotificationsByUserIdAsync(int userId)
        {
            return await _context.Notifications.Include(u=>u.Receiver ).Include(u=>u.Sender ).Include(p=>p.Project)
                .Where(n => n.ReceiverId == userId).Where(n => n.IsUnread == false)
                .ToListAsync();
        }

        // Create a new notification
        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

      

        // Delete notification
        public async Task DeleteAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }
        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _context.Notifications
                                               .Where(n => n.ReceiverId == userId && n.IsUnread)
                                               .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsUnread = false;
            }

            await _context.SaveChangesAsync();
        }
        public async Task<Notification> GetByIdAsync(int notificationId)
        {
            return await _context.Notifications
                .Include(n => n.Project)
                .Include(n => n.Receiver)
                .FirstOrDefaultAsync(n => n.Id == notificationId);
        }
        public async Task UpdateAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(IEnumerable<Notification> notifications)
        {
            _context.Notifications.UpdateRange(notifications);  // Update multiple entities at once
            await _context.SaveChangesAsync();
        }


        public async Task<List<Notification>> GetAllNotificationsByUserIdAsync(int userId)
        {
            return await _context.Notifications.Include(u => u.Receiver).Include(u => u.Sender).Include(p => p.Project)
                       .Where(n => n.ReceiverId == userId)
                       .ToListAsync();
        }

        public async Task DeleteRangeAsync(List<Notification> notifications)
        {
            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync();
        }
    }


}
