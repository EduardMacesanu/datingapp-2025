using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDto>> Register(RegistrerDto registrerDto)
    {
        if (await EmailExists(registrerDto.Email)) return BadRequest("Email already exists");

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = registrerDto.DisplayName,
            Email = registrerDto.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registrerDto.Password)),
            PasswordSalt = hmac.Key
        };
        context.Users.Add(user); // add user to db
        await context.SaveChangesAsync(); // save changes to db

        return user.ToDto(tokenService);
    }
    [HttpPost("login")] // api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
        if (user == null) return Unauthorized("Invalid email address ");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }
        
        return user.ToDto(tokenService);
    }

    
    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }

}
