using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Web.Http;
using StreamingPlatformFinder.Models;
using System.Net.Http;
using System.Web;
using System;
using System.Net;
using System.IO;
using System.Diagnostics;

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
        /// api to upload poster for a movie
        /// </summary>
        /// <param name="id">int id of the movie</param>
        /// <returns>Ok</returns>
        [HttpPost]
        [Route("{id:int}/upload")]
        public IHttpActionResult UploadPoster([FromUri] int id)
        {
            var movieInDb = _db.Movies.SingleOrDefault(m => m.Id == id);
            if (movieInDb == null)
            {
                return NotFound();
            }

            if (!Request.Content.IsMimeMultipartContent())
            {
                return StatusCode(HttpStatusCode.UnsupportedMediaType);
            }

            int numfiles = HttpContext.Current.Request.Files.Count;
            if (numfiles != 1 || HttpContext.Current.Request.Files[0] == null)
            {
                return BadRequest("Invalid file.");
            }

            //Check if the file is empty
            var poster = HttpContext.Current.Request.Files[0];
            if (poster.ContentLength <= 0)
            {
                return BadRequest("Invalid file.");
            }

            //establish valid file types (can be changed to other file extensions if desired!)
            var valtypes = new[] { "jpeg", "jpg", "png", "gif" };
            var extension = Path.GetExtension(poster.FileName).Substring(1);
            if (!valtypes.Contains(extension))
            {
                return BadRequest("Invalid file extention.");
            }

            try
            {
                //file name is the id of the image
                string fileName = id + "." + extension;

                //get a direct file path to ~/Content/animals/{id}.{extension}
                string path = Path.Combine(HttpContext.Current.Server.MapPath("~/Content/Images/"), fileName);

                //save the file
                poster.SaveAs(path);

                movieInDb.FileName = fileName;
                _db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Image was not saved successfully.");
                Debug.WriteLine("Exception:" + ex);
                return InternalServerError();
            }
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

            if (movieInDb.FileName != null)
            {
                string path = HttpContext.Current.Server.MapPath($"~/Content/Images/{movieInDb.FileName}");
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }

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