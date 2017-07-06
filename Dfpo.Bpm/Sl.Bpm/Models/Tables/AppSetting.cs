using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppSetting")]
    public class AppSetting : Entity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        [StringLength(500)]
        public string Name { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        [StringLength(4000)]
        public string Value { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
        [StringLength(50)]
        public string WfdWorkflowId { get; set; }
    }
}
