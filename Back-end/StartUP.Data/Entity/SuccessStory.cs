using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class SuccessStory
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = false;
        public int UserId{ get; set; }
        public int ProjectId { get; set; }

        [ForeignKey(nameof(UserId))]  
        public User User { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public Project Project { get; set; }

    }
}
