using Microsoft.AspNetCore.Http;

namespace StartUP.Service.ProjectService
{
    public class ProjectDetailsUpdateDto
    {
        public string Website { get; set; }
        public string ContactEmail { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Milestones { get; set; }
        public IFormFile? CompanyPhoto { get; set; }  // Important


    }
}