using System.Web.Mvc;

namespace Sl.Bpm.Application.Controllers
{
    public class DesignerController : Controller
    {
        // GET: Designer
        public ActionResult Index()
        {
            return View("~/App/SysDesigner/Layout.cshtml");
        }
    }
}