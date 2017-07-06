using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmRoleJob")]
    public class BpmRoleJob : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(100)]
        public string RoleId { get; set; }
        [StringLength(100)]
        public string JobId { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
