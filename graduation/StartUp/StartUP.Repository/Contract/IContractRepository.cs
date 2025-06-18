using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace StartUP.Repository.Contract
{
    public interface IContractRepository
    {
        Project GetProjectWithDeal(int projectId);
    }
}
