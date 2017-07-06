using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Yooya.Bpm.Models.ViewModel
{
    public class LoginViewModel
    {

        [Required]
        public string UsernameOrEmailAddress { get; set; }

        [Required]
        public string Password { get; set; }
        [DefaultValue(true)]
        public bool RememberMe { get; set; }
    }
}

