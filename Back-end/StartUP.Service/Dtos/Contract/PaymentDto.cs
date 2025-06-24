using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Contract
{
    public class PaymentDto
    {
        public string? CardNumber { get; set; }
        public string? CVV { get; set; }
        public string? ExpiryDate { get; set; }
        public string? PaymentMethod { get; set; }
       

    }
}
