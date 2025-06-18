using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.UserService;
using System.Security.Claims;

namespace StartUP.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

   
    public class ProfileController : ControllerBase
    {
        private readonly IUserServicecs _userService;

        public ProfileController(IUserServicecs userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var username = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(role))
                return Unauthorized("User identity is not valid.");

            if (role.ToLower() == "owner")
            {
                var info = await _userService.GetOwnerProfileAsync(username);
                if (info == null)
                    return NotFound("User Not Found");

                return Ok(new
                {
                    Message = $"Welcome, {username} 👋",
                    Info = info
                });
            }

            if (role.ToLower() == "investor")
            {
                var info = await _userService.GetInvestorProfileAsync(username);
                if (info == null)
                    return NotFound("User Not Found");

                return Ok(new
                {
                    Message = $"Welcome, {username} 👋",
                    Info = info
                });
            }

            return BadRequest("Unknown user role.");
        }





        [HttpGet("basicInfo")]
        public async Task<IActionResult> GetBasicInfo()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("User identity is not valid.");

            var info = await _userService.GetBasicInfoAsync(username);
            if (info == null)
                return NotFound("User Not Found");

            return Ok(new
            {
                Info = info
            });
        }

    }
}

