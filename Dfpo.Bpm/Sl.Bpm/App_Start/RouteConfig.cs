using System.Web.Mvc;
using System.Web.Routing;

namespace Sl.Bpm
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("SysPages/{resource}.aspx/{*pathInfo}");
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "SysPages", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
