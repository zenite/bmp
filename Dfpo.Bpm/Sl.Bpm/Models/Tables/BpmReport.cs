using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmReport")]
    public class BpmReport : CreationEntity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string LangName { get; set; }
        [StringLength(50)]
        public string LangDescription { get; set; }
        [StringLength(50)]
        public string Type { get; set; }
        public int? DisplayOrder { get; set; }
        [StringLength(50)]
        public string ParentReportId { get; set; }
        [StringLength(50)]
        public string EnterpriseId { get; set; }
    }
}