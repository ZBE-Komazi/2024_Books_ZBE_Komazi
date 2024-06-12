namespace API.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public bool IsRead { get; set; }
        public string Description { get; set; }
        public string UserName { get; set; }  // Foreign key

        // Navigation property
        public AppUser AppUser { get; set; }
    }
}
