using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstProc")]
    public class InstProc : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        /// <summary>
        /// 此RefId 作为流水号供交流使用
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RefId { get; set; } 

        [StringLength(50)]
        public string TaskId { get; set; }
        public int? NodeType { get; set; }
        [StringLength(50)]
        public string WfdWorkflowNodeId { get; set; }
        public DateTime? RecvTime { get; set; }
        public DateTime? ProcTime { get; set; }
        [StringLength(50)]
        public string ProcUser { get; set; }
        [StringLength(50)]
        public string ProcJobId { get; set; }
        [StringLength(50)]
        public string ProcOwner { get; set; }
        [StringLength(50)]
        public string ProcOwnerJobId { get; set; }
        public int? Status { get; set; }
        public string Note { get; set; }
        public DateTime? LastInformTime { get; set; }
        public DateTime? InformBeginTime { get; set; }
        [StringLength(50)]
        public string InformIntervalTime { get; set; }
        public decimal? OvertimeActionBeginTime { get; set; }
        [StringLength(200)]
        public string FormFile { get; set; }
        public int? IsWating { get; set; }
        /// <summary>
        /// 节点上的用户审批顺序
        /// </summary>
        public int? ProcNodeUserOrder { get; set; }
        [StringLength(50)]
        public string Action { get; set; }
        public int? Priority { get; set; }
        public int? WaitingDays { get; set; }
        public int? OverDateAutoExecute { get; set; }
        public int? Type { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }

        public InstProc()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
