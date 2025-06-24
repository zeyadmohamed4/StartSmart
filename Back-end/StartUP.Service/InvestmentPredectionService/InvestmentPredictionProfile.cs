using AutoMapper;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.InvestmentPredectionService
{
    public class InvestmentPredictionProfile : Profile
    {
        public InvestmentPredictionProfile()
        {
            CreateMap<InvestmentPrediction, InvestmentPredictionDto>()
                .ReverseMap();
        }
    }
}
