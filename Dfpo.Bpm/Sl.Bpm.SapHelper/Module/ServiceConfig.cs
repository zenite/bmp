using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MiniAbp.DataAccess;

namespace Sl.Bpm.SapHelper
{
    public class ServiceConfig
    {
        public ServiceConfig(string code)
        {
            DataTable dt = DbDapper.RunDataTableSql("select * from base_if_config where code='" + code + "'");
            if (dt.Rows.Count <= 0) return;
            DataRow dr = dt.Rows[0];
            Url = dr["if_url"].ToString();
            UserAccount = dr["if_user"].ToString();
            Password = dr["if_password"].ToString();
            ServiceName = dr["req_name"].ToString();
            RequestName = dr["param_name"].ToString();
            MethodName = dr["method_name"].ToString();
            RespName = dr["resp_name"].ToString();
            SAPIfCode = dr["sap_ifcode"].ToString();
            SAPSender = dr["sap_sender"].ToString();
            SAPReceiver = dr["sap_receiver"].ToString();
        }

        public string Url = string.Empty;
        public string UserAccount = string.Empty;
        public string Password = string.Empty;
        public string RequestName = string.Empty;
        public string ServiceName = string.Empty;
        public string MethodName = string.Empty;
        public string RespName = string.Empty;

        public string SAPIfCode = string.Empty;
        public string SAPSender = string.Empty;
        public string SAPReceiver = string.Empty;
    }
}
