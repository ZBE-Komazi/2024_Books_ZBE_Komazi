using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BookRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Book>> GetBooksAsync(string username)
        {
            return await _context.Books
                .Where(book => book.UserName == username)
                .ToListAsync();
        }

        public async Task<PagedList<BookDto>> GetBooksAsync(string username, UserParams userParams)
        {
            var query = _context.Books
                .Where(b => b.UserName == username)
                .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<BookDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }



        public async Task<IEnumerable<Book>> GetBooksByIdsAsync(List<int> ids, string userName)
        {
            return await _context.Books.Where(b => ids.Contains(b.Id) && b.UserName == userName).ToListAsync();
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
