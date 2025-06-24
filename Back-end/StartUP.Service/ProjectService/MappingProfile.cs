using AutoMapper;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.ProjectService
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<ProjectDetails, ProjectDetailsRequestDto>().ReverseMap();
            CreateMap<ProjectDetails, CampaignStoryDto>().ReverseMap();

        }
    }
}
