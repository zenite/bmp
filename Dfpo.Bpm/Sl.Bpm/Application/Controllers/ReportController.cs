﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sl.Bpm.Application.Controllers
{
    public class ReportController : Controller
    {
        // GET: Report
        public ActionResult Index()
        {
            return View("~/App/SysPages/Layout.cshtml");
        }

        public ActionResult ReportModule(string moduleId)
        {
            ViewBag.moduleId = moduleId;
           
            return View();
        }

    }
}