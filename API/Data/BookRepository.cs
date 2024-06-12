using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly DataContext _context;

        public BookRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetBooksAsync(string username)
        {
            return await _context.Books
                .Where(book => book.UserName == username)
                .ToListAsync();
        }

        public async Task<Book> GetBookAsync(int id, string username)
        {
            return await _context.Books
                .FirstOrDefaultAsync(book => book.Id == id && book.UserName == username);
        }

        public async Task AddBookAsync(Book book)
        {
            await _context.Books.AddAsync(book);
        }

        public async Task DeleteBookAsync(Book book)
        {
            _context.Books.Remove(book);
            await Task.CompletedTask;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
