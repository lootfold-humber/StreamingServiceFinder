using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StreamingPlatformFinder.Models
{
    public class Movie
    {
        public Movie()
        {
            Platforms = new List<Platform>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(100)]
        public string Director { get; set; }

        [Required]
        [StringLength(50)]
        public string Genre { get; set; }

        [Required]
        public int ReleaseYear { get; set; }

        public List<int> PlatformIds { get; set; }

        public List<Platform> Platforms { get; set; }
    }
}
