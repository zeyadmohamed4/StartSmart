using Microsoft.AspNetCore.Mvc;
using StartUP.Service.ContractService;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;

        public ContractController(IContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpGet("{projectId}")]
        public IActionResult GetContract(int projectId)
        {
            var contract = _contractService.GetContractAsync(projectId);

            if (contract == null)
                return NotFound("No contract found for the specified project.");

            return Ok(contract);
        }
    }
}
