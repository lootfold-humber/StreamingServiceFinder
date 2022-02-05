using System.Collections.Generic;

namespace StreamingPlatformFinder.Models
{
    public class PagedResult
    {
        public PagedResult(List<Movie> movies, int count)
        {
            Count = count;
            Movies = movies;
        }

        public List<Movie> Movies { get; set; }
        public int Count { get; set; }
    }
}