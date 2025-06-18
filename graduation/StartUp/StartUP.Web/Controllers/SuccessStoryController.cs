using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.Project;
using StartUP.Service.Dtos.SuccessStory;
using StartUP.Service.SuccessStoryService;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuccessStoryController : ControllerBase
    {
        
        private readonly ISuccessStoryService _service;

        public SuccessStoryController(ISuccessStoryService service)
        {
            _service = service;
        }

        [HttpGet("GetAllWithDescription")]
        public async Task<IActionResult> GetAllWithDescription()
        {
            var stories = await _service.GetAllAsyncWithDescription();
            return Ok(stories);
        }  
        [HttpGet("GetAllWithOutDescription")]
        public async Task<IActionResult> GetAllWithOutDescription()
        {
            var stories = await _service.GetAllAsyncWithOutDescription();
            return Ok(stories);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var story = await _service.GetByIdAsync(id);
            if (story == null) return NotFound("Story not found.");
            return Ok(story);
        }

        [HttpGet("GetRandom/")]
        public async Task<IActionResult> GetRandom()
        {
            var stories = await _service.GetRandomStoriesAsync();
            return Ok(stories);
        }

        [HttpGet("GetByUser/{username}")]
        public async Task<IActionResult> GetByUser(string username)
        {
            var stories = await _service.GetByUserNameAsync(username);
            return Ok(stories);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] SuccessStoryCreateDto successStoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.Identity?.Name;

            var result = await _service.AddAsync(successStoryDto ,username); 
            if (result == null)
            {
                return BadRequest("Could not create success story.");
            }

            return Ok("Success story created successfully.");
        }


        [HttpGet("pending-stories")]
        public async Task<IActionResult> GetPendingAddSuccessStoryAsync()
        {
            var stories = await _service.GetPendingAddSuccessStoryAsync();

            if (stories == null || !stories.Any())
                return NotFound("No pending success stories found.");

            return Ok(stories);
        }
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptStory([FromBody] AcceptDto dto)
        {
            var result = await _service.AcceptSuccessStoryAsync(dto);
            return Ok(new { message = "Success story accepted" });
        }

        [HttpPost("reject")]//reject and delete
        public async Task<IActionResult> RejectStory([FromBody] AcceptDto dto)
        {
            var result = await _service.RejectSuccessStoryAsync(dto);
            return Ok(new { message = "Success story rejected" });
        }
    }
}
