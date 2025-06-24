using AutoMapper;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Investment;
using StartUP.Service.ProjectService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.InvestmentService
{
    public class InvestmentProfile : Profile
    {
        public InvestmentProfile()
        {
            CreateMap<Investment, InvestmentRequestDto>().ReverseMap();
        }
    }
}
