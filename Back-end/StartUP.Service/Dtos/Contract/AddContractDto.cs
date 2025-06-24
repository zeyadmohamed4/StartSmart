using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.Contract
{
    public class AddContractDto
    {
        public string? FullName { get; set; }
        public string? Signature { get; set; }
        public IFormFile? Image { get; set; }

    }
}
