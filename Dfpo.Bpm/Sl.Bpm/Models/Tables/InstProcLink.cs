using System.ComponentModel.DataAnnotations;
using MiniAbp.DataAccess.Dapper;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("InstProcLink")]
    public class InstProcLink : Entity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string TaskId { get; set; }

        [StringLength(50)]
        public string ProcIdFrom { get; set; }
        [StringLength(50)]
        public string ProcIdTo { get; set; }
    }
}
