using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Ajax.Utilities;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowNode")]
    public class WfdWorkflowNode : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        /// <summary>
        /// 节点类型(0:开始;1:处理节点;2:自动处理节点;3:与节点;4:或节点;5:子流程节点;6:结束节点)
        /// </summary>
        public int? Type { get; set; }
        [StringLength(200)]
        public string Code { get; set; }
        [StringLength(200)]
        public string LangName { get; set; }
        [StringLength(100)]
        public string WfdFormId { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(1000)]
        public string Memo { get; set; }
        public bool? IsEntryEnable { get; set; }
        [StringLength(2000)]
        public string EntryCondition { get; set; }
        [StringLength(100)]
        public string ActionLinkId { get; set; }
        /// <summary>
        /// 处理策略(0:任意一个;1:同时处理;2:共享任务)
        /// </summary>
        public int? ProcessType { get; set; }
        [StringLength(1000)]
        public string ProcessorLinkId { get; set; }
        [StringLength(200)]
        public string JumpTypeBinary { get; set; }
        [StringLength(1000)]
        public string JumpNodeId { get; set; }
        [StringLength(100)]
        public string CopyLinkId { get; set; }
        [StringLength(100)]
        public string InformLinkId { get; set; }
        public bool? IsOvertimeInformEnable { get; set; }
        [StringLength(100)]
        public string OvertimeBeginTime { get; set; }
        [StringLength(100)]
        public string OvertimeIntervalTime { get; set; }
        [StringLength(100)]
        public string OvertimeInformLinkId { get; set; }
        public bool? IsOvertimeActionEnable { get; set; }
        [StringLength(100)]
        public string OvertimeActionTime { get; set; }
        public int? OvertimeActionType { get; set; }
        public bool? IsExamineEnable { get; set; }
        [StringLength(100)]
        public string ExamineStandardTime { get; set; }
        /// <summary>
        /// 自动处理节点处理类型(0:存储过程;1:DLL;2:SQL语句)
        /// </summary>
        public int? AutoCallType { get; set; }
        [StringLength(1000)]
        public string AutoCallValue { get; set; }
        [StringLength(1000)]
        public string SubWorkflowId { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        [Required]
        public float? Width { get; set; }
        [Required]
        public float? Height { get; set; }
        /// <summary>
        /// 0 代表图片类型， 1代表方形， 2代表圆形， 圆形使用x,y代表中心点，width代表半径 目前只有0
        /// </summary>
        [Required]
        public int? ShapeType { get; set; }
        [StringLength(1000)]
        public string ImageSrc { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        /// <summary>
        /// 是否所有链接Id 都有值
        /// </summary>
        /// <returns></returns>
       
        public void FillLinkValue()
        {
            if (this.ActionLinkId.IsNullOrWhiteSpace())
            {
                this.ActionLinkId = Guid.NewGuid().ToString();
            }
            if (this.CopyLinkId.IsNullOrWhiteSpace())
            {
                this.CopyLinkId = Guid.NewGuid().ToString();
            }
            if (this.InformLinkId.IsNullOrWhiteSpace())
            {
                this.InformLinkId = Guid.NewGuid().ToString();
            }
            if (this.ProcessorLinkId.IsNullOrWhiteSpace())
            {
                this.ProcessorLinkId = Guid.NewGuid().ToString();
            }
            if (this.OvertimeInformLinkId.IsNullOrWhiteSpace())
            {
                this.OvertimeInformLinkId = Guid.NewGuid().ToString();
            }
        }
    }
}
