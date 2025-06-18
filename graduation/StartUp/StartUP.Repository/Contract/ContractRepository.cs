using StartUP.Data.Entity;
using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace StartUP.Repository.Contract
{
    public class ContractRepository : IContractRepository
    {
        private readonly StartUPContext _context;

        public ContractRepository(StartUPContext context)
        {
            _context = context;
        }

        public Project GetProjectWithDeal(int projectId)
        {
            return _context.Projects
                .Include(p => p.CompanyDeal) // Load the CampaignDeal
                .FirstOrDefault(p => p.Id == projectId);
        }
    }

}
