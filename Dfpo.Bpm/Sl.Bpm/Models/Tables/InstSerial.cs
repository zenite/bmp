using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstSerial")]
    public class InstSerial:Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        [Required]
        public string Type { get; set; }
        [Required]
        [StringLength(50)]
        public string Prefix { get; set; }
        public int? Number { get; set; }

        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}
