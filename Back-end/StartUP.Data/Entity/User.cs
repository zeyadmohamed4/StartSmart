using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public long SSN { get; set; }
        public string Image { get; set; } = string.Empty;
        public bool IsActive { get; set; } = false;
        public string LinkedIn { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string? Experience { get; set; }
        public string? PreviousVenture { get; set; }
        public string? Education { get; set; }

        public ICollection<SuccessStory> SuccessStories { get; set; } = new List<SuccessStory>();
        public ICollection<FeedBack> FeedBacks { get; set; } = new List<FeedBack>();
        public ICollection<Investment> Investments { get; set; } = new List<Investment>();

        public ICollection<Project> Projects { get; set; } = new List<Project>();


    }
}
