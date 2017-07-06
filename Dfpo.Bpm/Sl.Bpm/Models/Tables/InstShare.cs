using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;


namespace Yooya.Bpm.Models.Tables
{
    [Table("InstShare")]
    public class InstShare: Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string ShareUserId { get; set; }
        [StringLength(50)]
        public string TaskId { get; set; }
        public DateTime? ShareTime { get; set; }
        [StringLength(200)]
        public string Reason { get; set; }
        [StringLength(50)]
        public string FormFile { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}
