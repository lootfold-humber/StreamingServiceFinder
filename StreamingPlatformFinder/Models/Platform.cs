using System.Collections.Generic;

namespace StreamingPlatformFinder.Models
{
    public class Platform
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Movie> Movies { get; set; }
    }
}