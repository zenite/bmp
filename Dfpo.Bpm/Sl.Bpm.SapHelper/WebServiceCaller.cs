using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Services.Description;
using System.Web.Services.Protocols;
using System.Xml.Serialization;

namespace Sl.Bpm.SapHelper
{
    public class WebServiceCaller
    {
        /// <summary>
        /// 调用接口
        /// </summary>
        /// <param name="wfheader"></param>
        /// <param name="args">接口所需参数</param>
        /// <param name="sc"></param>
        public static object CallService(ServiceConfig sc, SAPHeader wfheader, object args)
        {
            #region//调用WebService
            // 1. 使用 WebClient 下载 WSDL 信息。
            WebClient web = new WebClient();
            //添加身份验证
            if (sc.UserAccount != string.Empty)
                web.Credentials = new System.Net.NetworkCredential(sc.UserAccount, sc.Password);

            //添加链接
            Stream stream = web.OpenRead(sc.Url);

            // 2. 创建和格式化 WSDL 文档。
            ServiceDescription description = ServiceDescription.Read(stream);

            // 3. 创建客户端代理代理类。
            ServiceDescriptionImporter importer = new ServiceDescriptionImporter
            {
                ProtocolName = "Soap",// 指定访问协议。
                Style = ServiceDescriptionImportStyle.Client,// 生成客户端代理。
                CodeGenerationOptions =
                    CodeGenerationOptions.GenerateProperties | CodeGenerationOptions.GenerateNewAsync
            };
            importer.AddServiceDescription(description, null, null); // 添加 WSDL 文档。

            // 4. 使用 CodeDom 编译客户端代理类。
            CodeNamespace nmspace = new CodeNamespace(); // 为代理类添加命名空间，缺省为全局空间。
            CodeCompileUnit unit = new CodeCompileUnit();
            unit.Namespaces.Add(nmspace);

            ServiceDescriptionImportWarnings warning = importer.Import(nmspace, unit);
            CodeDomProvider provider = CodeDomProvider.CreateProvider("CSharp");

            CompilerParameters parameter = new CompilerParameters { GenerateExecutable = false, GenerateInMemory = true };
            parameter.ReferencedAssemblies.Add("System.dll");
            parameter.ReferencedAssemblies.Add("System.XML.dll");
            parameter.ReferencedAssemblies.Add("System.Web.Services.dll");
            parameter.ReferencedAssemblies.Add("System.Data.dll");

            CompilerResults result = provider.CompileAssemblyFromDom(parameter, unit);
            #endregion
            // 5. 使用 Reflection 调用 WebService。
            if (result.Errors.HasErrors) return null;
            Assembly asm = result.CompiledAssembly;
            //获取请求服务类型
            Type service = asm.GetType(sc.ServiceName);

            //获取请求参数类型
            Type reqtype = asm.GetType(sc.RequestName);
            object req = Activator.CreateInstance(reqtype);

            //创建固定头部
            Type headertype = asm.GetType("COM_HEADER");
            object header = Activator.CreateInstance(headertype);

            //头部参数赋值
            PropertyInfo[] pi = reqtype.GetProperties();
            PropertyInfo pheader = pi[0];

            string sp = string.Empty;
            Dictionary<string, object> dic = ObjectConverter.GetSAPObject(wfheader, out sp);
            PropertyInfo[] piheaders = headertype.GetProperties();
            foreach (PropertyInfo piheader in piheaders.Where(piheader => dic.ContainsKey(piheader.Name)))
            {
                piheader.SetValue(header, Convert.ChangeType(dic[piheader.Name], piheader.PropertyType), null);
            }
            pheader.SetValue(req, Convert.ChangeType(header, pheader.PropertyType), null);

            //获取主数据
            sp = string.Empty;
            dic = ObjectConverter.GetSAPObject(args, out sp);

            foreach (PropertyInfo pmstr in reqtype.GetProperties())
            {
                if (!dic.ContainsKey(pmstr.Name))
                    continue;
                //循环主数据
                if (!(dic[pmstr.Name] is IList)) continue;
                IList objmstrs = dic[pmstr.Name] as IList;
                if (objmstrs.Count <= 0) continue;
                //创建明细数组
                Array arrmstr = new ArrayList().ToArray();
                for (int i = 0; i < objmstrs.Count; i++)
                {
                    Dictionary<string, object> dicmstr = ObjectConverter.GetSAPObject(objmstrs[i], out sp);

                    Type mstr = asm.GetType(sp);
                    //初始化明细数组
                    if (i == 0)
                        arrmstr = Array.CreateInstance(mstr, objmstrs.Count);

                    object m = Activator.CreateInstance(mstr);

                    PropertyInfo[] pimstr = mstr.GetProperties();
                    foreach (PropertyInfo mstritem in pimstr.Where(mstritem => dicmstr.ContainsKey(mstritem.Name)))
                    {
                        //明细
                        if (dicmstr[mstritem.Name] is IList)
                        {
                            IList objds = dicmstr[mstritem.Name] as IList;
                            if (objds.Count > 0)
                            {
                                //创建明细数组
                                Array arr = new ArrayList().ToArray();
                                for (int j = 0; j < objds.Count; j++)
                                {
                                    Dictionary<string, object> dicdetail = ObjectConverter.GetSAPObject(objds[j], out sp);

                                    Type detail = asm.GetType(sp);
                                    //初始化明细数组
                                    if (j == 0)
                                        arr = Array.CreateInstance(detail, objds.Count);

                                    object d = Activator.CreateInstance(detail);

                                    PropertyInfo[] pidetail = detail.GetProperties();
                                    foreach (PropertyInfo item in pidetail.Where(item => dicdetail.ContainsKey(item.Name)))
                                    {
                                        item.SetValue(d, Convert.ChangeType(dicdetail[item.Name], item.PropertyType), null);
                                    }
                                    arr.SetValue(d, j);
                                }
                                //明细赋值到header
                                mstritem.SetValue(m, arr, null);
                            }
                        }
                        else
                        {
                            mstritem.SetValue(m, Convert.ChangeType(dicmstr[mstritem.Name], mstritem.PropertyType), null);
                        }
                    }
                    arrmstr.SetValue(m, i);
                }
                //明细赋值到header
                pmstr.SetValue(req, arrmstr, null);
            }

            object o = Activator.CreateInstance(service);
            //添加认证
            SoapHttpClientProtocol shp = o as SoapHttpClientProtocol;
            if (sc.UserAccount != string.Empty)
                shp.Credentials = new System.Net.NetworkCredential(sc.UserAccount, sc.Password);

            //调用方法
            MethodInfo method = service.GetMethod(sc.MethodName);
            object obj = method.Invoke(o, new object[] { req });
            return obj;
        }
    }
}
