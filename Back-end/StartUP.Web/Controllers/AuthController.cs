using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using StartUP.Data.Entity;
using StartUP.Data;
using StartUP.Data.Context;
using StartUP.Service.UserService;

namespace GoogleAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IGoogleAuthService _googleAuthService;

        public AuthController(IGoogleAuthService googleAuthService)
        {
            _googleAuthService = googleAuthService;
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var redirectUrl = Url.Action(nameof(GoogleResponse));
            return Challenge(new AuthenticationProperties { RedirectUri = redirectUrl }, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Authentication failed.");

            var email = authenticateResult.Principal?.Claims
                .FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;

            var username = authenticateResult.Principal?.Claims
                .FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(username))
                return BadRequest("Invalid Google response data.");

            var result = await _googleAuthService.HandleGoogleLoginAsync(email, username);

            if (!result.Success)
                return Conflict(new { message = result.Message, result.Data.Email, result.Data.UserName });

            return Ok(new { message = result.Message, result.Data.Email, result.Data.UserName });
        }



    }
}
