using StartUP.Repository.Contract;
using StartUP.Service.ContractService;
using StartUP.Service.Dtos.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.Contract
{
    public class ContractService : IContractService
    {
        private readonly IContractRepository _contractRepository;

        public ContractService(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<ContractDto> GetContractAsync(int projectId)
        {
            var project = _contractRepository.GetProjectWithDeal(projectId);
            if (project == null || project.CompanyDeal == null) return null;

            return new ContractDto
            {
                ProjectName = project.ProjectName,
                RiskTolerance = project.CompanyDeal.RiskTolerance,
                InvestmentHorizon = project.CompanyDeal.InvestmentHorizon,
                IncomePreference = project.CompanyDeal.IncomePreference,
                RepaymentTerms = project.CompanyDeal.RepaymentTerms,
                OwnershipOffered = project.CompanyDeal.OwnershipOffered,
            };
        }
    }

}
