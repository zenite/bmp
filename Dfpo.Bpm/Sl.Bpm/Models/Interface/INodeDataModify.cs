using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yooya.Bpm.Models.Interface
{
    public interface INodeDataModify
    {
        string Id { get; set; }

        #region 基本信息

        //string Code { get; set; }
        //int DisplayOrder { get; set; }
        //string LangName { get; set; }
        //string Memo { get; set; }

        #endregion

        #region 保存配置

        string WfdFormId { get; set; }
        int? ActionType { get; set; }
        string Processor { get; set; }
        string ProcessorJson { get; set; }
        string NoActionType { get; set; }
        string NoActionAsNodeCode { get; set; }
        string NoActionExitCondition { get; set; }
        bool? UseExamine { get; set; }
        string StandardTime { get; set; }
        bool? UseOvertimeInform { get; set; }
        string InformType { get; set; }
        string InformBeginTime { get; set; }
        string InformIntervalTime { get; set; }
        string InformUser { get; set; }
        int UseOvertimeAction { get; set; }
        string OvertimeActionBeginTime { get; set; }
        int? OvertimeActionType { get; set; }
        string OvertimeActionValue { get; set; }
        int? AutoCallType { get; set; }
        string AutoCallValue { get; set; }
        string AutoCallParam { get; set; }

        string SubWorkflowId { get; set; }
        string MsgFormat { get; set; }
        string ButtonsText { get; set; }
        string ExtensionField { get; set; }
        string ReturnToNodeCode { get; set; }
        string JumpCondition { get; set; }

        #endregion

        string WfdWorkflowId { get; set; }
    }
}
