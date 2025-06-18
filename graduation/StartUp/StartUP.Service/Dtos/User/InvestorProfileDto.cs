using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.User
{
    public class InvestorProfileDto
    {
        public string Image { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public int Investments { get; set; }
        public string PhoneNumber { get; set; }
    }
}
