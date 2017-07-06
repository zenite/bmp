using System;
using System.ComponentModel.DataAnnotations;
using MiniAbp.DataAccess.Dapper;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstAgent")]
    public class InstAgent : CreationEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string UserId { get; set; }
        [StringLength(100)]
        public string WfdCategoryId { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
        public int? UseJob { get; set; }
        [StringLength(100)]
        public string FirstUserId { get; set; }
        [StringLength(100)]
        public string SecondUserId { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        public bool Enable { get; set; } 
        public int? Order { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
    }
}
