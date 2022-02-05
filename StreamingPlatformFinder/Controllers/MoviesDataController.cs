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

        /// <summary>
        /// api to get all movies, supports pagination
        /// GET: /api/movies?pageNo=1&pageSize=5&searchKey=dune
        /// </summary>
        /// <param name="pageSize">no of movies per page</param>
        /// <param name="pageNo">page no to fetch</param>
        /// <param name="searchKey">key to search movie titles</param>
        /// <returns>
        /// {
        ///     "Movies": [
        ///         {
        ///             "Id": 31,
        ///             "Title": "Dune",
        ///             "Director": "Johnnie Tremblay",
        ///             "Genre": "Action",
        ///             "ReleaseYear": 2021,
        ///             "PlatformIds": null,
        ///             "Platforms": []
        ///         }
        ///     ],
        ///     "Count": 18
        /// }
        /// </returns>
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

        /// <summary>
        /// api to get movie by Id
        /// GET: /api/movies/{id}
        /// </summary>
        /// <param name="id">int id of the movie</param>
        /// <returns>
        /// {
        ///     "Id": 32,
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": null,
        ///     "Platforms": [
        ///         {
        ///             "Id": 3,
        ///             "Name": "Hulu",
        ///             "Movies": []
        ///         },
        ///         {
        ///             "Id": 6,
        ///             "Name": "Prime",
        ///             "Movies": []
        ///         }
        ///     ]
        /// }
        /// </returns>
        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetMovieById(int id)
        {
            var movieInDb = _db.Movies.Include(m => m.Platforms).SingleOrDefault(x => x.Id == id);

            if (movieInDb == null)
                return NotFound();

            return Ok(movieInDb);
        }

        /// <summary>
        /// api to add new movie
        /// POST: /api/movies/{id}
        /// </summary>
        /// <param name="movie">new movie object</param>
        /// <request>
        /// {
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": [1, 2],
        /// }
        /// </request>
        /// <returns>
        /// {
        ///     "Id": 32,
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": null,
        ///     "Platforms": []
        /// }
        /// </returns>
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

            if (newMovie.PlatformIds != null)
                newMovie.Platforms = GetPlatformsByIds(newMovie.PlatformIds);

            _db.SaveChanges();

            return Created(newMovie.Id.ToString(), newMovie);
        }

        /// <summary>
        /// api to update existing movie
        /// PUT: /api/movies/{id}
        /// </summary>
        /// <param name="id">int id of the movie to update</param>
        /// <param name="movie">updated movie object</param>
        /// <request>
        /// {
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": [1, 2],
        /// }
        /// </request>
        /// <returns>
        /// {
        ///     "Id": 32,
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": null,
        ///     "Platforms": []
        /// }
        /// </returns>
        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdateMovie([FromUri] int id, [FromBody] Movie movie)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movieInDb = _db.Movies.Include(m => m.Platforms).SingleOrDefault(x => x.Id == id);
            if (movieInDb == null)
                return NotFound();

            var duplicateMovieInDb = _db.Movies.SingleOrDefault(m =>
                                        m.Title == movie.Title &&
                                        m.Director == movie.Director &&
                                        m.ReleaseYear == movie.ReleaseYear);
            if (duplicateMovieInDb != null)
                return BadRequest("Movie already exists in the database.");

            movieInDb.Title = movie.Title;
            movieInDb.Director = movie.Director;
            movieInDb.ReleaseYear = movie.ReleaseYear;
            movieInDb.Genre = movie.Genre;

            if (movie.PlatformIds != null)
            {
                movieInDb.Platforms.RemoveAll(p => p != null);
                GetPlatformsByIds(movie.PlatformIds).ForEach(p =>
                {
                    movieInDb.Platforms.Add(p);
                });
            }

            _db.SaveChanges();

            return Ok(movieInDb);
        }

        /// <summary>
        /// api to delete a movie
        /// DELETE: /api/movies/32
        /// </summary>
        /// <param name="id">int id of the movie to delete</param>
        /// <returns>
        /// {
        ///     "Id": 32,
        ///     "Title": "MovieTitle",
        ///     "Director": "Emanuel Gislason",
        ///     "Genre": "Action",
        ///     "ReleaseYear": 2020,
        ///     "PlatformIds": null,
        ///     "Platforms": []
        /// }
        /// </returns>
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