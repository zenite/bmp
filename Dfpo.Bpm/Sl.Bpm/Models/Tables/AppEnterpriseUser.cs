using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppEnterpriseUser")]
    public class AppEnterpriseUser : Entity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
        [StringLength(50)]
        public string UserId { get; set; }
    }
}
