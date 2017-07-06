using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstTaskMark")]
    public class InstTaskMark : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string ByUserId { get; set; }
        [StringLength(100)]
        public string TaskId { get; set; }
        public DateTime? CreationTime { get; set; }
        [StringLength(400)]
        public string Reason { get; set; }
        public bool? IsMarked { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
