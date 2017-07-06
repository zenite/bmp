using System;
using System.Web;
using System.Web.Mvc;
using MiniAbp.DataAccess;
using MiniAbp.Dependency;
using MiniAbp.Domain.Entitys;
using Sl.Bpm.Application.Service;
using Sl.Bpm.Model.Tables;
using MiniAbp.Extension;
using Newtonsoft.Json;

namespace Sl.Bpm.Application.Controllers
{
    [Authorize]

    public class SysPagesController : Controller
    {
        public ActionResult Index()
        {
            return View("~/App/SysPages/Layout.cshtml");
        }

        public ActionResult AppPage(string nodeId, string pageId, string jobId, string taskId, string procId,
            string draftId, string areaCode, string topic = null, string isPrint = "0", string param = null, 
            string displayLanguages = null, string isPdf = "0", string isWaiting = "0")
        {
            if (string.IsNullOrWhiteSpace(pageId))
            {
                return new JsonResult() { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = "该链接无效，请检查单号或者页面是否存在。" };
            }
            ViewBag.pageId = pageId;
            ViewBag.jobId = jobId;
            ViewBag.nodeId = nodeId;
            ViewBag.taskId = taskId;
            ViewBag.procId = procId;
            ViewBag.draftId = draftId;
            ViewBag.isPrint = isPrint;
            ViewBag.areaCode = areaCode;
            ViewBag.param = param;
            ViewBag.isPdf = isPdf;
            ViewBag.displayLanguages = displayLanguages;
            ViewBag.topic = topic;
            ViewBag.isWaiting = isWaiting;
            var node = DbDapper.Get<WfdWorkflowNode>(nodeId);
            ViewBag.nodeType = node?.Type;
            return View();
        }

        public ActionResult SnNumber(string id, string topic = null, string param = null, 
            string displayLanguages = null, string isPdf = "0", string isWaiting = "0")
        {
            var table = DbDapper.RunDataTableSql(@"SELECT TOP(1) b.WfdWorkflowNodeId,c.AppPageId,b.TaskId,a.AreaCode FROM dbo.InstTask a
                INNER JOIN dbo.InstProc b ON a.Id = b.TaskId
                INNER JOIN dbo.WfdWorkflowNode c ON b.WfdWorkflowNodeId = c.Id
                WHERE Sn = @SnNumber AND b.NodeType IN (0,1)
                ORDER BY b.ProcTime DESC", new { SnNumber = id });

            if (table.Rows.Count > 0)
            {
                return Redirect("/SysPages/AppPage/?nodeId={0}&pageId={1}&taskId={2}&areaCode={3}&displayLanguages={4}&param={5}&isPdf={6}&topoc={7}"
                    .Fill(table.Rows[0]["WfdWorkflowNodeId"].ToString(),
                        table.Rows[0]["AppPageId"].ToString(),
                        table.Rows[0]["TaskId"].ToString(),
                        table.Rows[0]["AreaCode"].ToString(),
                        displayLanguages,
                        param,
                        isPdf,
                        topic,
                        isWaiting));
            }

            return RedirectToAction("ErrorMessage", "Account", new { error = "该单号为历史单号，请到老系统中查询" });
        }




        public ActionResult MplReport(string id, string param)
        {
            var table = DbDapper.RunDataTableSql(@"
                SELECT TOP ( 1 )
                        b.WfdWorkflowNodeId ,
                        c.AppPageId ,
                        b.TaskId ,
                        a.AreaCode
                FROM    dbo.InstTask a
                INNER JOIN dbo.InstProc b ON a.Id = b.TaskId
                INNER JOIN dbo.WfdWorkflowNode c ON b.WfdWorkflowNodeId = c.Id
                WHERE   Sn = @SnNumber
                        AND b.NodeType IN ( 0, 1 )
                ORDER BY b.ProcTime DESC", new { SnNumber = id });
            return Redirect(table.Rows.Count > 0 ? "/SysPages/AppPage/?nodeId={0}&pageId={1}&taskId={2}&areaCode={3}&param={4}".Fill(table.Rows[0]["WfdWorkflowNodeId"].ToString(), table.Rows[0]["AppPageId"].ToString(), table.Rows[0]["TaskId"].ToString(), table.Rows[0]["AreaCode"].ToString(), param) : "/SysPages/AppPage/?nodeId={0}&pageId={1}&taskId={2}&areaCode={3}".Fill("", "", "", ""));
        }
        public ActionResult Mpl01Report(string nodeId, string pageId, string jobId, string taskId,
            string procId, string draftId, string areaCode, string isPrint = "0", string param = null)
        {
            if (string.IsNullOrWhiteSpace(pageId))
            {
                return new JsonResult() { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = "该链接无效，请检查单号或者页面是否存在。" };
            }
            ViewBag.pageId = pageId;
            ViewBag.jobId = jobId;
            ViewBag.nodeId = nodeId;
            ViewBag.taskId = taskId;
            ViewBag.procId = procId;
            ViewBag.draftId = draftId;
            ViewBag.isPrint = isPrint;
            ViewBag.areaCode = areaCode;
            var node = DbDapper.Get<WfdWorkflowNode>(nodeId);
            ViewBag.nodeType = node?.Type;
            return View();
        }
    }
}