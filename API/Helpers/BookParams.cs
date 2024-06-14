namespace API.Helpers
{
    public class BookParams : PaginationParams
    {
        public string CurrentUsername { get; set; }
        public string OrderBy { get; set; } = "title";
    }
}
