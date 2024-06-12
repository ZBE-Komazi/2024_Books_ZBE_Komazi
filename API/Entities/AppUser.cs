using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace API.Entities
{
    public class AppUser : IdentityUser
    {
        public List<Book> Books { get; set; } = new List<Book>();
    }
}
