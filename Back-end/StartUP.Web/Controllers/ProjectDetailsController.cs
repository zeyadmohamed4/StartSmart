using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.Project;
using StartUP.Service.ProjectDetailsService;
using StartUP.Service.ProjectService;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectDetailsController : ControllerBase
    {
        private readonly IProjectDetails _service;

        public ProjectDetailsController(IProjectDetails service)
        {
            _service = service;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetAllPending()
        {
            var result = await _service.GetAllPendingAsync();
            return Ok(result);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound("Project_DetailsId NOt Found");
            return Ok(result);
        }

        [HttpPost("Add Project_Details")]
        public async Task<IActionResult> Add([FromForm] ProjectDetailsRequestDto dto)
        {
            await _service.AddAsync(dto);
            return Ok(new { message = "Project_Details added successfully." });
        }

        [HttpPut("UpdateProject_Details")]
        public async Task<IActionResult> Update(int id, [FromBody] CampaignStoryDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok(new { message = "Campaign Story added successfully" });
        }

        [HttpDelete("Delete Project_Details")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok(new { message = "Project_Details deleted successfully." });
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateProjectDetails(int id , [FromForm] ProjectDetailsUpdateDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid data");

            await _service.UpdateProjectDetailsAsync(id, dto);

            return Ok("Project details updated successfully");
        }
    }
}

