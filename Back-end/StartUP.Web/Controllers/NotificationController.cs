using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service;
using System.Security.Claims;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }


        [HttpGet("UnReadOwner")]
        public async Task<IActionResult> GetUnReadNotifications()
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _notificationService.GetNonReadNotificationsOwnerAsync(id);
            return Ok(result);
        }

        [HttpGet("UnReadInvestor")]
        public async Task<IActionResult> GetUnReadNotificationsInvestor()
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _notificationService.GetNonReadNotificationsInvestorAsync(id);
            return Ok(result);
        }

        [HttpGet("Read")]
        public async Task<IActionResult> GetReadNotifications()
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _notificationService.GetReadNotificationsAsyncAsync(id);
            return Ok(result);
        }

        [HttpPut("mark-as-read/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            await _notificationService.MarkAsReadAsync(notificationId);
            return Ok(new { message = "Notification marked as read." });
        }

        [HttpPut("mark-all-as-read")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            await _notificationService.MarkAllAsReadAsync(id);
            return Ok(new { message = "All notifications marked as read." });
        }

        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> Delete(int notificationId)
        {
            await _notificationService.DeleteAsync(notificationId);
            return Ok(new { message = "Notification deleted successfully." });
        }

        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAllNotifications()
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            try
            {
                await _notificationService.DeleteAllNotificationsAsync(id);
                return Ok(new
                {
                    message = $"All notifications deleted for user {id}."
                });
            }
            catch (ApplicationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
