using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.FeedBack;
using StartUP.Service.FeedBackService;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FeedBackController : ControllerBase
    {

        private readonly IFeedBackService _service;

        public FeedBackController(IFeedBackService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var feedBacks = await _service.GetAllAsync();
            return Ok(feedBacks);
        }


        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var feedBack = await _service.GetByIdAsync(id);
            if (feedBack == null) return NotFound("feedBack not found.");
            return Ok(feedBack);
        }

        [HttpGet("GetRandom/{count}")]
        public async Task<IActionResult> GetRandom(int count)
        {
            var feedBacks = await _service.GetRandomStoriesAsync(count);
            return Ok(feedBacks);
        }


        [HttpGet("GetByUser/{username}")]
        public async Task<IActionResult> GetByUser(string username)
        {
            var feedbacks = await _service.GetByUserNameAsync(username);
            return Ok(feedbacks);
        }


        [HttpPost("Create")]
        public async Task<IActionResult> Create( FeedBackDto feedBackDto)
        {
            var username = User.Identity?.Name;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AddAsync(feedBackDto,username);
            if (!result)
            {
                return BadRequest("Could not create FeedBack.");
            }

            return Ok("FeedBack created successfully.");
        }



    }
}
