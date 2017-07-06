using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Sl.Bpm.SapHelper
{
    public class SAPHeader
    {
        /// <summary>
        /// 操作标记
        /// </summary>
        public string Opguid = Guid.NewGuid().ToString().ToUpper();
        /// <summary>
        /// 接口编号-ZIFID
        /// </summary>
        [SYSField(SAPField = "ZIFID")]
        public string Sapifcode = string.Empty;
        /// <summary>
        /// 消息ID-ZPIMSGID
        /// </summary>
        [SYSField(SAPField = "ZPIMSGID")]
        public string TaskId = string.Empty;
        /// <summary>
        /// 发送方-ZSENDER
        /// </summary>
        [SYSField(SAPField = "ZSENDER")]
        public string Sender = string.Empty;
        /// <summary>
        /// 接收方-ZRECEIVER
        /// </summary>
        [SYSField(SAPField = "ZRECEIVER")]
        public string Receiver = string.Empty;
        /// <summary>
        /// 日期-DATUM
        /// </summary>
        [SYSField(SAPField = "DATUM")]
        public string Date = DateTime.Now.ToString("yyyyMMdd");
        /// <summary>
        /// 时间-UZEIT
        /// </summary>
        [SYSField(SAPField = "UZEIT")]
        public string Time = DateTime.Now.ToString("HHmmss");
        /// <summary>
        /// 发送时间-DTSEND
        /// </summary>
        [SYSField(SAPField = "DTSEND")]
        public string Sendtime = DateTime.Now.ToString("yyyyMMddHHmmss");
        /// <summary>
        /// 分发ID-DIS_ID
        /// </summary>
        [SYSField(SAPField = "DIS_ID")]
        public string Disid = string.Empty;
        /// <summary>
        /// 校验信息
        /// </summary>
        public string Checkmessage = string.Empty;
    }

    /// <summary>
    /// 属性
    /// </summary>
    public class SYSField : System.Attribute
    {
        public string SAPField { get; set; }
        public int Length { get; set; }
        public bool IsNumberic = false;
        public string BlankMessage { get; set; }
    }

    /// <summary>
    /// 属性
    /// </summary>
    public class ServiceClass : System.Attribute
    {
        public string SAPClass { get; set; }
    }

    public class HeaderBase
    {
        /// <summary>
        /// 操作标识
        /// </summary>
        public string MstrOpguid;
        /// <summary>
        /// 工作流任务号
        /// </summary>
        [SYSField(SAPField = "MSGID")]
        public string MstrTaskId;
        /// <summary>
        /// 工作流接口编号
        /// </summary>
        public string Ifcode;
        /// <summary>
        /// 创建人-空
        /// </summary>
        public string CreateUser;
    }

    /// <summary>
    /// 凭证的相关类
    /// </summary>
    public class ObjectConverter
    {
        /// <summary>
        /// 获取WFM接口实例对应的SAP实例
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, object> GetSAPObject(object obj, out string sapclass)
        {
            sapclass = string.Empty;
            Type t = obj.GetType();
            //获取类的对应SAP类
            if (t.GetCustomAttributes(true).Length > 0)
            {
                ServiceClass sc = t.GetCustomAttributes(true)[0] as ServiceClass;
                sapclass = sc.SAPClass;
            }

            Dictionary<string, object> dic = new Dictionary<string, object>();
            foreach (FieldInfo fi in t.GetFields())
            {
                //获取属性
                object[] o = fi.GetCustomAttributes(true);
                if (o.Length > 0)
                {
                    //获取字段的SAP字段
                    SYSField sf = o[0] as SYSField;
                    if (sf.SAPField == string.Empty) continue;
                    if (fi.GetValue(obj) != null)
                    {
                        dic.Add(sf.SAPField, fi.GetValue(obj));
                    }
                }
            }
            return dic;
        }

        /// <summary>
        /// 获取BPM接口实例对应的SAP实例
        /// </summary>
        /// <returns></returns>
        public static object GetRespObject(object obj, string targetname)
        {
            DataSet ds = new DataSet();
            Type t = obj.GetType();
            MemoryStream stream = new MemoryStream();
            XmlSerializer xml = new XmlSerializer(t);
            xml.Serialize(stream, obj);
            stream.Position = 0;
            StreamReader sr = new StreamReader(stream, Encoding.UTF8);
            string strxml = sr.ReadToEnd();
            sr.Close();
            stream.Close();

            XmlDocument xd = new XmlDocument();
            xd.LoadXml(strxml);

            string nodename = t.Name.ToString().Replace("[]", string.Empty);

            if (obj is Array || strxml.Contains("COM_HEADER"))
            {
                //创建类型
                Type ttype = Type.GetType(targetname);
                //创建实例
                Array resps = null;

                string nnm = "ArrayOf" + nodename;
                if (strxml.Contains("COM_HEADER"))
                    nnm = nodename;

                XmlNodeList nodes = xd.SelectNodes(nnm);

                int arrlength = nodes[0].ChildNodes.Count;
                int index = 0;
                foreach (XmlNode n in nodes[0].ChildNodes)
                {
                    if (n.Name == "COM_HEADER")
                    {
                        arrlength--;
                        continue;
                    }
                    Dictionary<string, string> dic = n.ChildNodes.Cast<XmlNode>().ToDictionary(it => it.Name, it => it.InnerText);

                    if (resps == null)
                        resps = Array.CreateInstance(ttype, arrlength);

                    //创建实例
                    object resp = Activator.CreateInstance(ttype);

                    foreach (FieldInfo fi in ttype.GetFields())
                    {
                        //获取属性
                        object[] o = fi.GetCustomAttributes(true);
                        if (o.Length <= 0) continue;
                        //获取字段的SAP字段
                        SYSField sf = o[0] as SYSField;
                        if (dic.ContainsKey(sf.SAPField))
                            fi.SetValue(resp, dic[sf.SAPField]);
                    }
                    resps.SetValue(resp, index);
                    index++;
                }
                return resps;
            }
            else
            {
                XmlNodeList nodes = xd.SelectNodes(nodename);
                Dictionary<string, string> dic = (from XmlNode node in nodes from XmlNode n in node.ChildNodes select n).ToDictionary(n => n.Name, n => n.InnerText);

                //创建类型
                Type ttype = Type.GetType(targetname);
                //创建实例
                object resp = Activator.CreateInstance(ttype);

                foreach (FieldInfo fi in ttype.GetFields())
                {
                    //获取属性
                    object[] o = fi.GetCustomAttributes(true);
                    if (o.Length <= 0) continue;
                    //获取字段的SAP字段
                    SYSField sf = o[0] as SYSField;
                    if (dic.ContainsKey(sf.SAPField))
                        fi.SetValue(resp, dic[sf.SAPField]);
                }
                return resp;
            }
        }

        /// <summary>
        /// 返回一个类的所有字段
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static string GetTypeField(Type t)
        {
            StringBuilder sb = new StringBuilder("[");
            foreach (FieldInfo fi in t.GetFields())
            {
                object[] o = fi.GetCustomAttributes(true);
                if (o.Length <= 0) continue;
                SYSField sf = o[0] as SYSField;
                if (fi.FieldType.IsGenericType) continue;
                sb.Append("{\"finame\":\"");
                sb.Append(fi.Name);
                sb.Append("\",\"length\":\"");
                sb.Append(sf.Length);
                sb.Append("\",\"isnumberic\":\"");
                sb.Append(sf.IsNumberic ? "1" : "0");
                sb.Append("\",\"blankmsg\":\"");
                sb.Append(sf.BlankMessage);
                sb.Append("\"},");
            }
            sb.Remove(sb.Length - 1, 1);
            sb.Append("]");
            return sb.ToString();
        }
    }
}
