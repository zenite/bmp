using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("BpmBusinessTableColumn")]
    public class BpmBusinessTableColumn : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }

        [StringLength(50)]
        public string LangName { get; set; }
        /// <summary>   
        /// 字段名称
        /// </summary>
        [Required]
        [StringLength(50)]
        public string SchemaName { get; set; }
        /// <summary>
        /// 字段类型
        /// TableColumnType
        /// </summary>
        [Required]
        public int Type { get; set; }
        /// <summary>
        /// 最大长度
        /// </summary>
        public int MaxLength { get; set; }
        /// <summary>
        /// 是否必填
        /// </summary>
        [Required]
        public bool IsRequired { get; set; }
        /// <summary>
        /// 字段排序
        /// </summary>
        public int? DisplayOrder { get; set; }
        /// <summary>
        /// 关联表Id
        /// </summary>
        [Required]
        public string BusinessTableId { get; set; }
        /// <summary>
        /// 关联公司Id
        /// </summary>
        [Required]
        public string EnterpriseId { get; set; }
        /// <summary>
        /// 字段说明
        /// </summary>
        public string Memo { get; set; }
    }
}