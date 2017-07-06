using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Yooya.Bpm.Models.ViewModel
{
    public class InitializeViewModel
    {
        [Required]
        public string EnterpriseAccessId { get; set; }

        [Required]
        public string UserAccessId { get; set; }

        [Required]
        public string UsernameOrEmailAddress { get; set; }

        [Required]
        public string Password { get; set; }

        [DefaultValue(true)]
        public bool RememberMe { get; set; }

        [Required]
        public string EnterpriseId { get; set; }

        [Required]
        public string SyncServiceAddress { get; set; }
    }
}