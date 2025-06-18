using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class FeedBack
    {
        [Key]
        public int Id { get; set; }
        public string Massage { get; set; }
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars.")]
        public int Stars { get; set; }
        public int UserId { get; set; } 
        [ForeignKey(nameof(UserId))] 
        public User User { get; set; }
    }
}
