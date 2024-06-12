namespace API.DTOs
{
    public class CreateBookDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public bool IsRead { get; set; }
        public string Description { get; set; }
    }
}
