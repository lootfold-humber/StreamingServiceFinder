using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamingPlatformFinder.Controllers
{
    public class PlatformsController : Controller
    {
        // GET: Platforms
        public ActionResult Index()
        {
            return View();
        }
    }
}