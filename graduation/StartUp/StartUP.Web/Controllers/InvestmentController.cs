using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Data.Entity;
using StartUP.Service.Dtos.Contract;
using StartUP.Service.Dtos.Investment;
using StartUP.Service.Dtos.Project;
using StartUP.Service.InvestmentService;
using StartUP.Service.ProjectService;
using System.Security.Claims;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestmentController : ControllerBase
    {
        private readonly IInvestmentService _service;
        public InvestmentController(IInvestmentService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<ActionResult> Create(InvestmentRequestDto investmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var isSuccess = await _service.AddAsync(investmentDto, id);
            if (isSuccess==null)
                return BadRequest("Investment Failed");

            return Ok (isSuccess);
        }
        //[HttpPut("Update/{id}")]
        //public async Task<ActionResult> Update(int id, InvestmentRequestDto investmentDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var isSuccess = await _service.UpdateAsync(id, investmentDto);
        //    if (!isSuccess)
        //        return NotFound();

        //    return Ok("Investment Updated Successfully");

        //}

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var isSuccess = await _service.DeleteAsync(id);
            if (!isSuccess)
                return NotFound();

            return Ok("Investment Deleted Successfully");
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<InvestmentResponseDto>>> GetAllAsync()
        {
            var invest = await _service.GetAllAsync();
            return Ok(invest);

        }


        [HttpGet("GetAllPending")]
        public async Task<ActionResult<IEnumerable<investmentPending>>> GetAllPendingAsync()
        {
            var invest = await _service.GetAllPendingAsync();
            return Ok(invest);

        }


        [HttpPost("AcceptInvestment")]
        public async Task<IActionResult> AcceptInvestment(AcceptDto acceptInvestmentDto, int notfiId)
        {
            try
            {
                var senderId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _service.AcceptInvestment(acceptInvestmentDto, senderId, notfiId);

                return Ok(result); // إرجاع البيانات الخاصة بالاستثمار بعد القبول
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("RejectInvestment")]
        public async Task<IActionResult> DeleteInvestment(AcceptDto acceptInvestmentDto, int notifId)
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _service.RejectInvestment(acceptInvestmentDto, id, notifId);
            return Ok("Investment Recjected successfully.");
        }


        [HttpDelete("DeleteInvestment/{investmentId}")]
        public async Task<IActionResult> DeleteInvestment(int investmentId)
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _service.DeleteInvestment(investmentId, id);
            return Ok("Investment deleted successfully.");
        }

        [HttpGet("investors-Growth/{ownerUserName}")]
        public async Task<IActionResult> GetInvestorCount(string ownerUserName)
        {
            var count = await _service.GetInvestorCountByOwnerUserNameAsync(ownerUserName);
            return Ok(new { ownerUserName, investorCount = count });
        }

        [HttpGet("total-investments/{ownerUserName}")]
        public async Task<IActionResult> GetTotalInvestmentsForOwner(string ownerUserName)
        {
            var totalInvestments = await _service.GetTotalInvestmentsByOwnerUserNameAsync(ownerUserName);
            return Ok(totalInvestments);
        }

        [HttpGet("total-revenue/{ownerUserName}")]
        public async Task<IActionResult> GetTotalRevenueForOwner(string ownerUserName)
        {
            var totalRevenue = await _service.GetTotalRevenueByOwnerUserNameAsync(ownerUserName);
            return Ok(totalRevenue);
        }


        [HttpGet("Get_Investment")]
        public async Task<IActionResult> GetInvestment(int projectId)
        {
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var totalRevenue = await _service.GetInvestment(projectId , id);
            return Ok(totalRevenue);
        }


        [HttpPost("addContract")]
        public async Task<ActionResult> AddContract([FromForm]AddContractDto contractDto, int id)
        {
            var contract = await _service.AddContractAsync(contractDto, id);
            return Ok(contract);
        }
        [HttpPost("payment")]
        public async Task<ActionResult> AddPayment(PaymentDto paymentDto, int id)
        {
            var payment = await _service.AddPaymentAsync(paymentDto, id);
            return Ok(payment);
        }
    }
}
