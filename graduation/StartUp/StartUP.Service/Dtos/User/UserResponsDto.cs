using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.User
{
    public class UserResponsDto
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string PhoneNumber { get; set; }
        public int Age { get; set; }
        public long SSN { get; set; }
        public string Image { get; set; }
        public string LinkedIn { get; set; }
        public string Country { get; set; }
        public string Status { get; set; }
        public string City { get; set; }
    }
}
