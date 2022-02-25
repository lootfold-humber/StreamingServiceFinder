using StreamingPlatformFinder.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;

namespace StreamingPlatformFinder.Controllers
{
    [RoutePrefix("api/platforms")]
    public class PlatformsDataController : ApiController
    {
        private readonly AppDbContext _db = new AppDbContext();

        /// <summary>
        /// api to get all platforms
        /// GET: /api/platforms
        /// </summary>
        /// <returns>
        /// [
        ///     {
        ///         "Id": 3,
        ///         "Name": "Hulu",
        ///         "Movies": null
        ///     },
        ///     {
        ///         "Id": 2,
        ///         "Name": "Netflix",
        ///         "Movies": null
        ///     }
        /// ]
        /// </returns>
        [HttpGet]
        [Route("")]
        public IEnumerable<Platform> GetPlatforms()
        {
            return _db.Platforms;
        }

        /// <summary>
        /// api to get platforms by Id
        /// GET: /api/platforms/{id}
        /// </summary>
        /// <param name="id">int id of the patform</param>
        /// <returns>
        /// {
        ///     "Id": 3,
        ///     "Name": "Hulu",
        ///     "Movies": null
        /// }
        /// </returns>
        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetPlatformById([FromUri] int id)
        {
            var platformInDB = _db.Platforms.Include(p => p.Movies).SingleOrDefault(x => x.Id == id);

            if (platformInDB == null)
                return NotFound();

            return Ok(platformInDB);
        }

        /// <summary>
        /// api to add new platform
        /// POST: /api/platforms
        /// </summary>
        /// <param name="platform">platform object</param>
        /// <request>
        /// {
        ///     "name": "Disney Plus"
        /// }
        /// </request>
        /// <returns>
        /// {
        ///     "Id": 7,
        ///     "Name": "Disney Plus",
        ///     "Movies": null
        /// }
        /// </returns>
        [HttpPost]
        [Route("")]
        public IHttpActionResult AddPlatform([FromBody] Platform platform)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var platformInDb = _db.Platforms.SingleOrDefault(p => p.Name == platform.Name);
            if (platformInDb != null)
                return BadRequest("Platform already exists in the database.");

            var newPlatform = _db.Platforms.Add(platform);
            _db.SaveChanges();

            return Created(newPlatform.Id.ToString(), newPlatform);
        }

        /// <summary>
        /// api to update platform
        /// PUT: /api/platforms/{id}
        /// </summary>
        /// <param name="id">int id of the platform to update</param>
        /// <param name="platform">updated platform object</param>
        /// <request>
        /// {
        ///     "name": "Disney+"
        /// }
        /// </request>
        /// <returns>
        /// {
        ///     "Id": 7,
        ///     "Name": "Disney+",
        ///     "Movies": null
        /// }
        /// </returns>
        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdatePlatform([FromUri] int id, [FromBody] Platform platform)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var platformInDb = _db.Platforms.SingleOrDefault(p => p.Id == id);

            if (platformInDb == null)
                return NotFound();

            var duplicatePlatformInDb = _db.Platforms.SingleOrDefault(p => p.Name == platform.Name);
            if (duplicatePlatformInDb != null && duplicatePlatformInDb.Id != platformInDb.Id)
                return BadRequest("Platform already exists in the database.");

            platformInDb.Name = platform.Name;
            _db.SaveChanges();

            return Ok(platformInDb);
        }

        /// <summary>
        /// api to delete platform by Id
        /// DELETE: /api/platforms/{id}
        /// </summary>
        /// <param name="id">int id of the patform to delete</param>
        /// <returns>
        /// {
        ///     "Id": 3,
        ///     "Name": "Hulu",
        ///     "Movies": null
        /// }
        /// </returns>
        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult DeletePlatform([FromUri] int id)
        {
            var platformInDb = _db.Platforms.SingleOrDefault(p => p.Id == id);

            if (platformInDb == null)
                return NotFound();

            _db.Platforms.Remove(platformInDb);
            _db.SaveChanges();

            return Ok(platformInDb);
        }
    }
}
