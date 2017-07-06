using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstVariable")]
    public class InstVariable : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string TaskId { get; set; }

        [StringLength(50)]
        public string VariableName { get; set; }

        public string VariableValue { get; set; }
    }
}
