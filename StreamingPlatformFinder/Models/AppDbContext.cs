using System.Data.Entity;

namespace StreamingPlatformFinder.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : base("AppConnectionString")
        {

        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Platform> Platforms { get; set; }
    }
}