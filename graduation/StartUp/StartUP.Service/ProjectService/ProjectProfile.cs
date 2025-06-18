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
    public class ProjectProfile :Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectDtoResponse>().
                ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => Enum.Parse<Category>(src.Category)));

        }
    }
}
