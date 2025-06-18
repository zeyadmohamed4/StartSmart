using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace StartUP.Service.Dtos.Project
{
    public class ProjectDetailsRequestDto
    {
        public string? Website { get; set; }
        public string? ContactEmail { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public string? Milestones { get; set; }
        public IFormFile? CompanyPhoto { get; set; }
        public string? CampaignStory { get; set; }
        public int ProjectId { get; set; }


    }
}
