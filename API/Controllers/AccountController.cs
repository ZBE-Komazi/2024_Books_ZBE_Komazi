using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController: BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

     [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if(await UserExists(registerDto.UserName) || await EmailExists(registerDto.Email)) return BadRequest("Username or email is taken");

        var user = new AppUser
        {
            UserName = registerDto.UserName.ToLower(),
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user,registerDto.Password);
        
        if(!result.Succeeded) return BadRequest(result.Errors);

        return new UserDto{
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    [HttpPost("login")] // POST: api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
            .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);

        if (user == null) return Unauthorized("Invalid username");

        var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);
        if (!result) return Unauthorized("Invalid password");


        return new UserDto{
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
    }

    // if somehow the user bypasses the IdenityCore service for making the email unique.
    private async Task<bool> EmailExists(string email)
    {
        return await _userManager.Users.AnyAsync(x => x.Email == email);
    }
}