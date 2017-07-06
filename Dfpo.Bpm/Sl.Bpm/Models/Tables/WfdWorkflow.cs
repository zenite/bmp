using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflow")]
    public class WfdWorkflow : CreationEntity
    { 
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        /// <summary>
        /// 系统预定义流程编号 用于表示系统流程。
        /// </summary>
        [StringLength(100)]
        public string FromWorkflowId { get; set; }

        [StringLength(100)]
        public string Code { get; set; }
        [StringLength(100)]
        public string LangName { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(500)]
        public string Memo { get; set; }
       
        //可能存在多种情况，@小乐 比如很蛋疼的一种业务出现了，领导的节点可以取消这个任务
        //获取发起人节点可以取消，其他节点不允许
        //默认情况下 1 代表可以 0 代表不可以 其他数值待确认。
       
        [StringLength(50)]
        public string WfdCategoryId { get; set; }
        public double? Zoom { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
        public bool? IsDeleted { get; set; }
   
        public override DateTime? CreationTime { get; set; }
        [StringLength(50)]

        public override string CreatorUserId { get; set; }
        public WfdWorkflow()
        {
            Zoom = 1;
        }
        public WfdWorkflow CopyNew()
        {
            var wf = (WfdWorkflow)MemberwiseClone();
            wf.RefreshId();
            return wf;
        } 
    }
}
