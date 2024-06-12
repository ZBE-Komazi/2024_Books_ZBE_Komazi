using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetBooksAsync(string username);
        Task<Book> GetBookAsync(int id, string username);
        Task AddBookAsync(Book book);
        Task DeleteBookAsync(Book book);
        Task<bool> SaveAllAsync();
    }
}
