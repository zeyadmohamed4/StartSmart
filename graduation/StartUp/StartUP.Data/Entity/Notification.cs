using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class Notification
    {

        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; } // The user who will receive this notification 
        public int? ProjectId { get; set; }
        public string Message { get; set; } // Short message (e.g. "Investment accepted")
        public string FullMessage { get; set; } // Detailed message
        public DateTime CreatedAt { get; set; }
        public bool IsUnread { get; set; } = true;
        public string? Type { get; set; }
        public string? Status { get; set; }



        public string? ProjectName { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public  Project? Project { get; set; }
        [ForeignKey(nameof(ReceiverId))]
        public  User Receiver { get; set; }
        [ForeignKey(nameof(SenderId))]
        public User Sender { get; set; }

    }
}
