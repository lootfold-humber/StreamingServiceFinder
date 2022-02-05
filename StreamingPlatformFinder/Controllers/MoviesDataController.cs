using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Web.Http;
using StreamingPlatformFinder.Models;

namespace StreamingPlatformFinder.Controllers
{
    [RoutePrefix("api/movies")]
    public class MoviesDataController : ApiController
    {
        private readonly AppDbContext _db = new AppDbContext();

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllMovies(
            int pageSize = 10,
            int pageNo = 1,
            string searchKey = null)
        {
            var totalMovies = _db.Movies.Count();

            var movies = _db.Movies.AsQueryable();

            if (searchKey != null)
                movies = movies.Where(m => m.Title.Contains(searchKey));

            movies = movies
                        .OrderBy(m => m.Title)
                        .Skip((pageNo - 1) * pageSize)
                        .Take(pageSize);

            return Ok(new PagedResult(movies.ToList(), totalMovies));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetMovieById(int id)
        {
            var movieInDb = _db.Movies.Include(m => m.Platforms).SingleOrDefault(x => x.Id == id);

            if (movieInDb == null)
                return NotFound();

            return Ok(movieInDb);
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult AddMovie(Movie movie)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movieInDb = _db.Movies.SingleOrDefault(m =>
                                    m.Title == movie.Title &&
                                    m.Director == movie.Director &&
                                    m.ReleaseYear == movie.ReleaseYear);

            if (movieInDb != null)
                return BadRequest("Movie already exists in the database.");

            var newMovie = _db.Movies.Add(movie);
            newMovie.Platforms = GetPlatformsByIds(newMovie.PlatformIds);

            _db.SaveChanges();

            return Created(newMovie.Id.ToString(), newMovie);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdateMovie([FromUri] int id, [FromBody] Movie movie)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movieInDb = _db.Movies.SingleOrDefault(x => x.Id == id);

            if (movieInDb == null)
                return NotFound();

            movieInDb.Title = movie.Title;
            movieInDb.Director = movie.Director;
            movieInDb.ReleaseYear = movie.ReleaseYear;
            movieInDb.Genre = movie.Genre;

            _db.SaveChanges();

            return Ok(movieInDb);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult DeleteMovie([FromUri] int id)
        {
            var movieInDb = _db.Movies.SingleOrDefault(x => x.Id == id);

            if (movieInDb == null)
                return NotFound();

            _db.Movies.Remove(movieInDb);
            _db.SaveChanges();

            return Ok(movieInDb);
        }

        private List<Platform> GetPlatformsByIds(List<int> ids)
        {
            return _db.Platforms.Where(x => ids.Contains(x.Id)).ToList();
        }
    }
}