using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{ 
    public interface IBookRepository
    {
        Task<PagedList<BookDto>> GetBooksAsync(string username,UserParams userparams);
        Task<IEnumerable<Book>> GetBooksAsync(string username);
        Task<Book> GetBookAsync(int id, string username);
        Task<IEnumerable<Book>> GetBooksByIdsAsync(List<int> ids, string userName);
        Task AddBookAsync(Book book);
        Task DeleteBookAsync(Book book);
        Task<bool> SaveAllAsync();
    }
}
