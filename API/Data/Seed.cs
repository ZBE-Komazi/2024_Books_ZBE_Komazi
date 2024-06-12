using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace API.Data
{
    public static class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager)
        {

            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach (var userWithBooks in users)
            {
                userWithBooks.UserName = userWithBooks.UserName.ToLower();
                userWithBooks.Email = userWithBooks.Email.ToLower();
                await userManager.CreateAsync(userWithBooks, "Pa$$w0rd");
            }
        }
    }
}
