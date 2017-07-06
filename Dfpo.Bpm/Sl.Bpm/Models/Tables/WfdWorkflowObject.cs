using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdWorkflowObject")]
    public class WfdWorkflowObject : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        public int? Type { get; set; }
        [Required]
        public int ShapeType { get; set; }
        [StringLength(100)]
        public string LangText { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Width { get; set; }
        public float? Height { get; set; }
        [StringLength(4000)]
        public string TextStyle { get; set; }
        [StringLength(1000)]
        public string ImageSrc { get; set; }
        [StringLength(100)]
        public string EnterpriseId { get; set; }
        [StringLength(100)]
        public string WfdWorkflowId { get; set; }
    }
}
