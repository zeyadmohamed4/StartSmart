using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Dtos.SuccessStory
{
    public class SuccessStoryDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Description { get; set; }
        public string ProjectName { get; set; }
        public string UserImage { get; set; }
        public string Category { get; set; }


    }
}
