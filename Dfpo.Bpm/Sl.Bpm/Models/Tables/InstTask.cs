using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstTask")]
    public class InstTask : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [Required]
        public int RefId { get; set; }
        [StringLength(100)]
        public string WfdCategoryId { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
        [StringLength(100)]
        public string CreateBy { get; set; }
        [StringLength(100)]
        public string CreateByJobId { get; set; }
        [StringLength(100)]
        public string CreateByGroupId { get; set; }
        public DateTime? CreationTime { get; set; }
        public DateTime? FinishedTime { get; set; }
        public int? Priority { get; set; }
        public int? Status { get; set; }
        [StringLength(100)]
        public string ParentTaskId { get; set; }
        public string Memo { get; set; }
        [StringLength(1000)]
        public string ConnectTable { get; set; }
        [StringLength(20)]
        public string Site { get; set; }
        [StringLength(40)]
        public string Sn { get; set; }
        [StringLength(600)]
        public string Topic { get; set; }
        [StringLength(72)]
        public string RejectBy { get; set; }
        [StringLength(100)]
        public string ParentProcId { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        [StringLength(16)]
        public string FormFieldsJson { get; set; }
    }
}
