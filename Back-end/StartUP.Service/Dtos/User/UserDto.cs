using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.User
{
    public class UserDto
    {
        [Required]
        public string UserName { get; set; }
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string ConfirmPassword { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public long SSN { get; set; }
        [Required]
        public string LinkedIn { get; set; }
        [Required]
        public IFormFile Image { get; set; }

        public string Country { get; set; }

        public string City { get; set; }
    }
}