using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;

namespace Yooya.Bpm.Models.Tables
{
    [Table("WfdForm")]
    public class WfdForm : Entity
    {
        [Key]
        [StringLength(50)]
        public override string Id { get; set; }
        [StringLength(50)]
        public string Name { get; set; }      
        [StringLength(100)]
        public string TableName { get; set; }      
        public string Description { get; set; }
        [StringLength(50)]
        public string FromWfdFormsId { get; set; }

        #region Mobile Part
        [StringLength(100)]
        public string MobileFormName { get; set; }      
        public string MobileHtml { get; set; }

        public string MobileController { get; set; }
        #endregion

        #region PC Part
        [StringLength(100)]
        public string PcFormName { get; set; }      
        public string PcHtml { get; set; }

        public string PcController { get; set; }
        #endregion
        [StringLength(50)]
        public string EnterpriseId { get; set; }

        public WfdForm()
        {
            Id = Guid.NewGuid().ToString();
        }

        public WfdForm CopyNew()
        {
            var form = (WfdForm)MemberwiseClone();
            form.Id = Guid.NewGuid().ToString();
            return form;
        }
    }
}
