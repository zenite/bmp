using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstTaskCopy")]
    public class InstTaskCopy : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string ToUserId { get; set; }
        [StringLength(100)]
        public string FromUserId { get; set; }
        [StringLength(100)]
        public string TaskId { get; set; }
        [StringLength(100)]
        public string ProcId { get; set; }
        public DateTime? CreationTime { get; set; }
        [StringLength(400)]
        public string Reason { get; set; }
        public bool? IsRead { get; set; }
        [StringLength(100)]
        public string FormId { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
