using StartUP.Service.Dtos.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Service.ContractService
{
    public interface IContractService
    {
        Task<ContractDto> GetContractAsync(int projectId);
    }
}