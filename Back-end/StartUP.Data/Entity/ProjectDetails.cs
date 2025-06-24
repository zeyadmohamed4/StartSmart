using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Entity
{
    public class ProjectDetails
    {
        public int Id { get; set; }
        public string Website { get; set; }
        public string ContactEmail { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Milestones { get; set; }
        public string? CompanyPhoto { get; set; }
        public string? CampaignStory { get; set; }
        public bool IsPending { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public Project Project { get; set; }
        public int ProjectId { get; set; }


    }
}
