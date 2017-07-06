using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MiniAbp;
using MiniAbp.Runtime;
using Sl.Bpm.Application.Module;
using Sl.Bpm.Engine.Db;

namespace Sl.Bpm.AppPages.Workflow
{
    public class Common : ModuleBase
    {
        //A组织包含B组织 parentGroupId groupId
        public bool GroupIsUnderGroup(ArgsInput args)
        {
            var parent = args["parentGroupId"];
            var group = args["groupId"];
            var val = Repository.GetDataTable(@"WITH    temp
                                                  AS ( SELECT   *
                                                       FROM     dbo.BpmGroup AS gg
                                                       WHERE    Id = @group
                                                       UNION ALL
                                                       SELECT   g.*
                                                       FROM     temp ,
                                                                dbo.BpmGroup g
                                                       WHERE    temp.ParentGroupId = g.Id
                                                     )
                                            SELECT  *
                                            FROM    temp
                                            WHERE   Id = @parent", new { parent, group });
            return val.Rows.Count >= 1;
        }

        //A组织包含B岗位 jobId groupId
        public bool JobIsUnderGroup(ArgsInput args)
        {
            var job = args["jobId"];
            var group = args["groupId"];
            var val = Repository.GetDataTable(@"WITH    temp
                                                  AS ( SELECT   gg.*
                                                       FROM     dbo.BpmGroup AS gg
                                                                INNER JOIN dbo.BpmJob j ON gg.Id = j.GroupId
                                                       WHERE    j.Id = @job
                                                       UNION ALL
                                                       SELECT   g.*
                                                       FROM     temp ,
                                                                dbo.BpmGroup g
                                                       WHERE    temp.ParentGroupId = g.Id
                                                     )
                                            SELECT  *
                                            FROM    temp
                                            WHERE   Id = @group", new { job, group });
            return val.Rows.Count >= 1;
        }

        //A组织包含B用户 userId groupId
        public bool UserIsUnderGroup(ArgsInput args)
        {
            var user = args["userId"];
            var group = args["groupId"];
            var val = Repository.GetDataTable(@"WITH    temp
                                                  AS ( SELECT   gg.*
                                                       FROM     dbo.BpmGroup AS gg
                                                                INNER JOIN dbo.BpmJob j ON gg.Id = j.GroupId
                                                                INNER JOIN dbo.BpmJobUser ju ON j.Id = ju.JobId
                                                       WHERE    ju.UserId = @user
                                                       UNION ALL
                                                       SELECT   g.*
                                                       FROM     temp ,
                                                                dbo.BpmGroup g
                                                       WHERE    temp.ParentGroupId = g.Id
                                                     )
                                            SELECT  *
                                            FROM    temp
                                            WHERE   Id = @group", new { user, group });
            return val.Rows.Count >= 1;
        }

        //A岗位包含B岗位 parentJobId jobId
        public bool JobIsUnderJob(ArgsInput args)
        {
            var parent = args["parentJobId"];
            var job = args["jobId"];
            var val = Repository.GetDataTable(@"WITH    temp
                                                  AS ( SELECT   *
                                                       FROM     dbo.BpmJob AS gg
                                                       WHERE    Id = @job
                                                       UNION ALL
                                                       SELECT   g.*
                                                       FROM     temp ,
                                                                dbo.BpmJob g
                                                       WHERE    temp.ParentJobId = g.Id
                                                     )
                                            SELECT  *
                                            FROM    temp
                                            WHERE   Id = @parent", new { parent, job });
            return val.Rows.Count >= 1;
        }

        //简繁体转换 v:转换的值 type：1转繁体，2转简体
        public string SimpleToFan(ArgsInput args)
        {
            var v = args["v"];
            var type = args["type"];
            return Application.Base.Common.StringConvert(v, Convert.ToInt32(type));
        }

        /// <summary>
        /// PDF添加合并文件
        /// </summary>
        /// <param name="input"></param>
        public void ExportPdf(ArgsInput input)
        {
            var sn = input["sn"];
            var fileName = input["fileName"] + "-" + DateTime.Now.ToString("yyyyMMddhhmmss");
            var sourceText = input["SourceText"];
            var sourceIdentity = input["SourceIdentity"];
            var fileInputs = input["FileInput"] ?? "";
            var displayLanguages = input["DisplayLanguages"] ?? Session.LanguageCulture;
            var operationType = Convert.ToInt32(input["OperationType"]);
            var param = input["Param"];

            var urlDt = Repository.GetDataTable(@"SELECT * FROM dbo.AppEnterpriseSetting WHERE Name = 'bpmWebUrl'");

            if (urlDt.Rows.Count <= 0 || string.IsNullOrEmpty(urlDt.Rows[0]["Value"].ToString()))
                throw new UserFriendlyException("未设置系统路由，请求助管理员");

            var pdfInput = string.Format("{0}SysPages/SnNumber?id={1}&displayLanguages={2}&param={3}&ispdf=1", urlDt.Rows[0]["Value"], sn, displayLanguages, param);

            var ufInput = pdfInput;

            //多个合并文件目录
            if (operationType == 2 && !string.IsNullOrEmpty(fileInputs))
            {
                ufInput = string.Join(",", fileInputs.Split(',').Select(fileInput => AppPath.RootPath + fileInput).ToList());
            }

            var queueId = Guid.NewGuid().ToString();

            var jobConvertSql = @"
                INSERT INTO dbo.JobConvertQueue
                ( Id , CallingSource , SourceType , TargetType , CreationTime , ExecutionTime , Status , 
                    Input , Output ,  Result , LanguageCulture )
                VALUES  ( @queueId , -- Id - nvarchar(50)
                        @sourceIdentity , -- CallingSource - nvarchar(50)
                        1 , -- SourceType - int
                        2 , -- TargetType - int
                        GETDATE() , -- CreationTime - datetime
                        null , -- ExecutionTime - datetime
                        0 , -- Status - int
                        @pdfInput , -- Input - nvarchar(max)
                        null , -- Output - nvarchar(max)
                        null , -- Result - nvarchar(max)
                        @lang  -- LanguageCulture - nvarchar(50)
                        )";

            var userFileSql = @"
                INSERT INTO dbo.BpmUserFile
                        ( Id ,UserId ,QueueId ,FileName ,SourceText ,SourceIdentity ,OperationType ,Input ,
                            Output ,Status ,DownloadTimes ,CreationTime ,CompletionTime)
                VALUES  ( newid() , -- Id - nvarchar(50)
                        @UserId , -- UserId - nvarchar(50)
                        @queueId , -- QueueId - nvarchar(50)
                        @fileName , -- FileName - nvarchar(max)
                        @sourceText , -- SourceText - nvarchar(max)
                        @sourceIdentity , -- SourceIdentity - nvarchar(max)
                        @operationType , -- OperationType - int 需要合并的文件
                        @ufInput , -- Input - nvarchar(max)
                        null , -- Output - nvarchar(max)
                        0 , -- Status - int
                        0 , -- DownloadTimes - int
                        GETDATE() , -- CreationTime - datetime
                        null  -- CompletionTime - datetime
                        )";

            Repository.Execute(jobConvertSql, new { queueId, pdfInput, lang = Session.LanguageCulture, sourceIdentity });

            Repository.Execute(userFileSql,
                new { Session.UserId, queueId, fileName, sourceText, sourceIdentity, ufInput, operationType });



        }


        public class PackagePdfDto
        {
            public string Sn { get; set; }
            public string FileName { get; set; }
            public string SourceText { get; set; }
            public string SourceIdentity { get; set; }
            public int OperationType { get; set; }
            public int TargetType { get; set; }
            public string FileInputs { get; set; }
            public string DisplayLanguages { get; set; }
            public string Param { get; set; }
            public string PackagePdfName { get; set; }
        }

        public class CalculateBudgetDto
        {
            public string BudgetYear { get; set; }
            public string BudgetMonth { get; set; }
            public string CostCenter { get; set; }
            public string Account { get; set; }
            public string ProjectNo { get; set; }
            public string ClassCode { get; set; }
            public string ItemCode { get; set; }
            public int GridOrder { get; set; }
            public decimal Amount { get; set; }
        }

        public class CalculateBudgetRp
        {
            public decimal Amount { get; set; }
            public decimal RestAmounts { get; set; }
            public int GridOrder { get; set; }
        }

        /// <summary>
        /// PDF添加合并文件
        /// </summary>
        /// <param name="input"></param>
        public void ExportPackagePdf(ArgsInput input)
        {
            var dtos = Deserialize<List<PackagePdfDto>>(input["pdfArray"]);

            if (dtos.Count == 0) return;

            var urlDt = Repository.GetDataTable(@"SELECT * FROM dbo.AppEnterpriseSetting WHERE Name = 'bpmWebUrl'");

            if (urlDt.Rows.Count <= 0 || string.IsNullOrEmpty(urlDt.Rows[0]["Value"].ToString()))
                throw new UserFriendlyException("未设置系统路由，请求助管理员");

            ArrayList sqlArray = new ArrayList();

            var zipId = "";

            if (dtos.Count > 1)
            {
                zipId = Guid.NewGuid().ToString();
                var packageUserFileSql = @"
                INSERT INTO dbo.BpmUserFile
                        ( Id ,UserId ,QueueId ,FileName ,SourceText ,SourceIdentity ,OperationType ,Input ,
                            Output ,Status ,DownloadTimes ,CreationTime ,CompletionTime,ParentUserFileId)
                VALUES  ( '" + zipId + @"' , -- Id - nvarchar(50)
                        '" + Session.UserId + @"' , -- UserId - nvarchar(50)
                        NULL , -- QueueId - nvarchar(50)
                        '" + dtos[0].PackagePdfName + "-" + DateTime.Now.ToString("yyyyMMddhhmmss") + @"' , -- FileName - nvarchar(max)
                        NULL , -- SourceText - nvarchar(max)
                        NULL , -- SourceIdentity - nvarchar(max)
                        3 , -- OperationType - int 需要合并的文件
                        NULL , -- Input - nvarchar(max)
                        null , -- Output - nvarchar(max)
                        0 , -- Status - int
                        0 , -- DownloadTimes - int
                        GETDATE() , -- CreationTime - datetime
                        null,  -- CompletionTime - datetime
                        NULL
                        )";

                sqlArray.Add(packageUserFileSql);
            }

            var i = 0;
            foreach (var dto in dtos)
            {
                i++;
                var pdfInput = string.Format("{0}SysPages/SnNumber?id={1}&displayLanguages={2}&param={3}&ispdf=1", urlDt.Rows[0]["Value"], dto.Sn, dto.DisplayLanguages, dto.Param);
                var ufInput = pdfInput;
                //多个合并文件目录
                if (dto.OperationType == 2 && !string.IsNullOrEmpty(dto.FileInputs))
                {
                    ufInput = string.Join(",", dto.FileInputs.Split(',').Select(fileInput => AppPath.RootPath + fileInput).ToList());
                }

                var fileName = dto.FileName + "-" + DateTime.Now.ToString("yyyyMMddhhmmss") + i;


                var queueId = Guid.NewGuid().ToString();

                var jobConvertSql = @"
                INSERT INTO dbo.JobConvertQueue
                ( Id , CallingSource , SourceType , TargetType , CreationTime , ExecutionTime , Status , 
                    Input , Output ,  Result , LanguageCulture )
                VALUES  ( '" + queueId + @"' , -- Id - nvarchar(50)
                        '" + dto.SourceIdentity + @"' , -- CallingSource - nvarchar(50)
                        1 , -- SourceType - int
                        2 , -- TargetType - int
                        GETDATE() , -- CreationTime - datetime
                        null , -- ExecutionTime - datetime
                        0 , -- Status - int
                        '" + pdfInput + @"' , -- Input - nvarchar(max)
                        null , -- Output - nvarchar(max)
                        null , -- Result - nvarchar(max)
                        '" + dto.DisplayLanguages + @"'  -- LanguageCulture - nvarchar(50)
                        )";

                var userFileSql = @"
                INSERT INTO dbo.BpmUserFile
                        ( Id ,UserId ,QueueId ,FileName ,SourceText ,SourceIdentity ,OperationType ,Input ,
                            Output ,Status ,DownloadTimes ,CreationTime ,CompletionTime,ParentUserFileId)
                VALUES  ( newid() , -- Id - nvarchar(50)
                        '" + Session.UserId + @"' , -- UserId - nvarchar(50)
                        '" + queueId + @"' , -- QueueId - nvarchar(50)
                        '" + fileName + @"' , -- FileName - nvarchar(max)
                        '" + dto.SourceText + @"' , -- SourceText - nvarchar(max)
                        '" + dto.SourceIdentity + @"' , -- SourceIdentity - nvarchar(max)
                        " + Convert.ToInt32(dto.OperationType) + @" , -- OperationType - int 需要合并的文件
                        '" + ufInput + @"' , -- Input - nvarchar(max)
                        null , -- Output - nvarchar(max)
                        0 , -- Status - int
                        0 , -- DownloadTimes - int
                        GETDATE() , -- CreationTime - datetime
                        null,  -- CompletionTime - datetime
                        '" + zipId + @"'
                        )";


                sqlArray.Add(jobConvertSql);
                sqlArray.Add(userFileSql);
            }

            //RunInTransactionSqls(sqlArray);
            DBHelper.RunInTransaction(sqlArray);
        }

        /// <summary>
        /// 流程提交判断是否超预算，返回当前剩余预算
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="costcenter"></param>
        /// <param name="account"></param>
        /// <param name="projno"></param>
        /// <param name="projectitem"></param>
        /// <param name="procitemcode"></param>
        /// <returns></returns>
        public decimal CalculateBudget(ArgsInput args)
        {
            var year = args["year"];
            var month = args["month"];
            var costcenter = args["costcenter"];
            var account = args["account"];
            var projno = args["projno"];
            var projitemcode = args["projitemcode"];
            var projclasscode = args["projclasscode"];
            System.Data.DataTable dt = Repository.GetDataTable(" exec Proc_Fin_CalculateBudget '" + year + "','" + month + "','" + costcenter + "','" + account + "','" + projno + "','" + projclasscode + "','" + projitemcode + "'");
            if (dt.Rows.Count > 0)
                return decimal.Parse(dt.Rows[0]["SurplusAmt"].ToString());
            return 0m;

        }

        public List<CalculateBudgetRp> CalculateBudgetAll(ArgsInput args)
        {
            var ca = Deserialize<List<CalculateBudgetDto>>(args["calcul"]);
            var retList = new List<CalculateBudgetRp>();
            foreach (var c in ca)
            {
                var rp = new CalculateBudgetRp();
                System.Data.DataTable dt = Repository.GetDataTable(" exec Proc_Fin_CalculateBudget '" + c.BudgetYear + "','" + c.BudgetMonth + "','" + c.CostCenter + "','" + c.Account + "','" + c.ProjectNo + "','" + c.ClassCode + "','" + c.ItemCode + "'");
                rp.GridOrder = c.GridOrder;
                rp.Amount = c.Amount;
                if (dt.Rows.Count > 0)
                {
                    rp.RestAmounts = decimal.Parse(dt.Rows[0]["SurplusAmt"].ToString());
                }
                else
                {
                    rp.RestAmounts = 0m;
                }
                retList.Add(rp);
            }
            return retList;
        }

        public bool SchedulePoDownloadPdfStatus(ArgsInput args)
        {
            var snS = StringSplit(args["sns"]);
            Repository.Execute(string.Format(@"UPDATE dbo.yfvic_pur09_mpo_appcation SET PdfStatus = 1 WHERE SnNumber IN ({0})", snS));
            ExportPackagePdf(args);
            return true;
        }

        public bool SpotPoDownloadPdfStatus(ArgsInput args)
        {
            var snS = StringSplit(args["sns"]);
            Repository.Execute(string.Format(@"UPDATE dbo.yfvic_pur20_purchase_order_application SET PdfStatus = 1 WHERE SnNumber IN ({0})", snS));
            ExportPackagePdf(args);
            return true;
        }

        public bool LowValueDownloadPdfStatus(ArgsInput args)
        {
            var snS = StringSplit(args["sns"]);
            Repository.Execute(string.Format(@"UPDATE dbo.yfvic_pur18_material_requirement SET PdfStatus = 1 WHERE SnNumber IN ({0})", snS));
            ExportPackagePdf(args);
            return true;
        }

        public string StringSplit(string str)
        {
            var ids = str.Split(',');
            var snS = string.Empty;
            foreach (var s in ids)
            {
                snS += string.Format("'{0}',", s);
            }
            if (snS.Length > 0)
            {
                snS = snS.Substring(0, snS.Length - 1);
            }
            return snS;
        }

    }
}