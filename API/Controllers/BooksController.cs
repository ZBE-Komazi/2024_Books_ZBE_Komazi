using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class BooksController : BaseApiController
    {
        private readonly IBookRepository _bookRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<BooksController> _logger;

        public BooksController(IBookRepository bookRepository, UserManager<AppUser> userManager, IMapper mapper, ILogger<BooksController> logger)
        {
            _bookRepository = bookRepository;
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
        }
/*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            _logger.LogInformation("Fetching books for user: {UserName}", userNameClaim);

            var books = await _bookRepository.GetBooksAsync(userNameClaim);
            return Ok(_mapper.Map<IEnumerable<BookDto>>(books));
        }
*/

        [HttpGet]
        public async Task<ActionResult<PagedList<BookDto>>> GetBooks([FromQuery] UserParams userParams)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            _logger.LogInformation("Fetching books for user: {UserName}", userNameClaim);

            var books = await _bookRepository.GetBooksAsync(userNameClaim, userParams);
            Response.AddPaginationHeader(new PaginationHeader(books.CurrentPage, books.PageSize, books.TotalCount, books.TotalPages));
            return Ok(_mapper.Map<IEnumerable<BookDto>>(books));
        }

        [HttpPost("ids")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooksByIds([FromBody] IdsDto idsDto)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            var books = await _bookRepository.GetBooksByIdsAsync(idsDto.Ids, userNameClaim);
            if (books == null || !books.Any()) return NotFound();

            return Ok(_mapper.Map<IEnumerable<BookDto>>(books));
        }


        [HttpPost]
        public async Task<ActionResult<BookDto>> AddBook(BookDto bookDto)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ;

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == userNameClaim);
            if (user == null)
            {
                _logger.LogError("User not found.");
                return Unauthorized("User is not authenticated");
            }

            var book = _mapper.Map<Book>(bookDto);
            book.UserName = user.UserName;
            book.AppUser = user;
            book.Date = DateTime.Now;

            await _bookRepository.AddBookAsync(book);
            if (await _bookRepository.SaveAllAsync())
            {
                _logger.LogInformation("Book added successfully for user: {UserName}", userNameClaim);
                return Ok(_mapper.Map<BookDto>(book));
            }
            return BadRequest("Failed to add book");
        }


        [HttpGet("pastmonth")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooksPastMonth()
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            _logger.LogInformation("Fetching past month books for user: {UserName}", userNameClaim);

            var books = await _bookRepository.GetBooksAsync(userNameClaim);
            var pastMonthBooks = books.Where(b => b.Date >= DateTime.Now.AddDays(-30));
            return Ok(_mapper.Map<IEnumerable<BookDto>>(pastMonthBooks));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            _logger.LogInformation("Fetching book with ID {BookId} for user: {UserName}", id, userNameClaim);

            var book = await _bookRepository.GetBookAsync(id, userNameClaim);
            if (book == null) return NotFound();
            return Ok(_mapper.Map<BookDto>(book));
        }



        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBook(int id, BookDto bookDto)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            var book = await _bookRepository.GetBookAsync(id, userNameClaim);
            if (book == null) return NotFound();

            var originalId = book.Id;

            _mapper.Map(bookDto, book);


            book.Id = originalId;


            book.Date = DateTime.Now;

            if (await _bookRepository.SaveAllAsync())
            {
                _logger.LogInformation("Book with ID {BookId} updated successfully for user: {UserName}", id, userNameClaim);
                return NoContent();
            }
            return BadRequest("Failed to update book");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            var book = await _bookRepository.GetBookAsync(id, userNameClaim);
            if (book == null) return NotFound();
            await _bookRepository.DeleteBookAsync(book);
            if (await _bookRepository.SaveAllAsync())
            {
                _logger.LogInformation("Book with ID {BookId} deleted successfully for user: {UserName}", id, userNameClaim);
                return NoContent();
            }
            return BadRequest("Failed to delete book");
        }

        [HttpPatch("{id}/markAsRead")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userNameClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userNameClaim))
            {
                _logger.LogError("UserName claim not found.");
                return Unauthorized("User is not authenticated");
            }

            var book = await _bookRepository.GetBookAsync(id, userNameClaim);
            if (book == null)
            {
                return NotFound();
            }

            if (!book.IsRead)
            {
                book.IsRead = true;
                book.Date = DateTime.UtcNow;
                await _bookRepository.SaveAllAsync();
            }

            return NoContent();
        }



    }
}
