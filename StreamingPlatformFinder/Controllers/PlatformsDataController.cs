using StreamingPlatformFinder.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace StreamingPlatformFinder.Controllers
{
    [RoutePrefix("api/platforms")]
    public class PlatformsDataController : ApiController
    {
        private readonly AppDbContext _db = new AppDbContext();

        [HttpGet]
        [Route("")]
        public IEnumerable<Platform> GetPlatforms()
        {
            return _db.Platforms;
        }

        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetPlatformById([FromUri] int id)
        {
            var platformInDB = _db.Platforms.SingleOrDefault(x => x.Id == id);

            if (platformInDB == null)
                return NotFound();

            return Ok(platformInDB);
        }

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

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult UpdatePlatform([FromUri] int id, [FromBody] Platform platform)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var platformInDb = _db.Platforms.SingleOrDefault(p => p.Id == id);

            if (platformInDb == null)
                return NotFound();

            platformInDb.Name = platform.Name;
            _db.SaveChanges();

            return Ok(platformInDb);
        }

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
