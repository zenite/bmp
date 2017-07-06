using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowRight")]
    public class WfdWorkflowRight : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string ValueType { get; set; }
        [StringLength(1000)]
        public string Value { get; set; }
        [StringLength(1000)]
        public string ValueDisplay { get; set; }
        public string Allow { get; set; }
        public string Forbid { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        [Required]
        public DateTime CreationTime { get; set; }
        public int? CreatorUserId { get; set; }
    }
}
