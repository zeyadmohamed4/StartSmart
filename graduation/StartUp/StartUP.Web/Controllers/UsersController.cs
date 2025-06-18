using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartUP.Service.Dtos.User;
using StartUP.Service.UserService;
using StartUP.Web.Controllers;
using System.Linq;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserServicecs _userService;

    public UsersController(IUserServicecs userService)
    {
        _userService = userService;
    }

    [HttpPost("SignUp")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> SignUp([FromForm] UserDto userDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (userDto.Password != userDto.ConfirmPassword)
        {
            return BadRequest("Passwords do not match.");
        }

        var result = await _userService.RegisterUserAsync(userDto);
        if (!result)
        {
            return Conflict("User with the same email already exists.");
        }

        return Ok(new
        {
            success = true,
            message = "Registration Is Pending approval"
        });
    }




    [HttpPost("Login")]
    public async Task<IActionResult> LogIn(LoginDto login)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);

        }

        var result = await _userService.LoginUserAsync(login);

        if (!result.Success)
        {
            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        return Ok(new
        {
            success = true,
            token = result.Token,
            message = result.Message
        });

    }

    [HttpGet("GetUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUserAsync();
        return Ok(users);

    }

    [HttpGet("GetOwners")]
    public async Task<IActionResult> GetAllOwners()
    {
        var owners = await _userService.GetAllOwnerAsync();
        return Ok(owners);

    }


    [HttpGet("GetInvestors")]
    public async Task<IActionResult> GetAllInvestors()
    {
        var investors = await _userService.GetAllInvestorAsync();
        return Ok(investors);

    }

    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPassword resetPasswordDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.ResetPasswordAsync(resetPasswordDto.Email);
        if (string.IsNullOrEmpty(result))
        {
            return BadRequest("Password reset failed. Please check the email and try again.");
        }

        return Ok($"New password: {result}");
    }

    [HttpGet("GetPendingUsers")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var users = await _userService.GetPendingUserAsync();
        return Ok(users);

    }

    [HttpPost("AcceptUser")]
    public async Task<IActionResult> AcceptUser(AcceptUserDto acceptUserDto)
    {
        var user = await _userService.AcceptUser(acceptUserDto);
        return Ok("User Accepted successfully.");
    }

    [HttpPost("DeleteUser")]
    public async Task<IActionResult> DeleteUser(AcceptUserDto acceptUserDto)
    {
        var user = await _userService.RejectUser(acceptUserDto);
        return Ok("User Recjected successfully.");
    }

    [HttpPut("Create-professional-info")]
    public async Task<IActionResult> UpdateProfessionalInfo(string userName, [FromBody] UserProfessionalDto dto)
    {
        if (dto == null)
            return BadRequest("Invalid data.");

        var updatedInfo = await _userService.UpdateAsync(userName, dto);

        if (updatedInfo == null)
            return NotFound("User not found");

        return Ok(new
        {
            Message = "User professional information updated successfully.",
            Data = updatedInfo
        });
    }


}
