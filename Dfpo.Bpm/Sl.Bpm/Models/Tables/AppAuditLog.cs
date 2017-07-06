using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MiniAbp.Domain;
using MiniAbp.Web.Auditing;

namespace Yooya.Bpm.Models.Tables
{
    [Table("AppAuditLog")]
    public class AppAuditLog : IEntity<string>
    {
      
        [Key]
        [StringLength(50)]
        public string Id { get; set; }
        /// <summary>
        /// UserId.
        /// </summary>
        [StringLength(50)]
        public string UserId { get; set; }

        /// <summary>
        /// Service (class/interface) name.
        /// </summary>
        [StringLength(256)]
        public string ServiceName { get; set; }

        /// <summary>
        /// Executed method name.
        /// </summary>
        [StringLength(256)]
        public string MethodName { get; set; }

        /// <summary>
        /// Calling parameters.
        /// </summary>
        public string RequestJson { get; set; }
        public string ResponseJson { get; set; }

        /// <summary>
        /// Start time of the method execution.
        /// </summary>
        public DateTime ExecutionTime { get; set; }

        /// <summary>
        /// Total duration of the method call.
        /// </summary>
        public int Duration { get; set; }

        /// <summary>
        /// IP address of the client.
        /// </summary>
        [StringLength(64)]
        public string ClientIpAddress { get; set; }

        /// <summary>
        /// Name (generally computer name) of the client.
        /// </summary>
        [StringLength(128)]
        public string ClientName { get; set; }

        /// <summary>
        /// Browser information if this method is called in a web request.
        /// </summary>
        [StringLength(256)]
        public string BrowserInfo { get; set; }

        /// <summary>
        /// Exception object, if an exception occured during execution of the method.
        /// </summary>
        public string Exception { get; set; }

        public AppAuditLog(AuditInfo info)
        {
            Id = Guid.NewGuid().ToString();
            this.UserId = info.UserId;
            this.Exception = info.Exception;
            this.ExecutionTime = info.ExecutionTime;
            this.ClientIpAddress = info.ClientIpAddress;
            this.ClientName = info.ClientName;
            this.Duration = info.Duration;
            this.ServiceName = info.ServiceName.ToLower();
            this.MethodName = info.MethodName.ToLower();
            this.BrowserInfo = info.BrowserInfo;
            this.RequestJson = info.RequestJson;
            this.ResponseJson = info.ResponseJson;
        }
        public override string ToString()
        {
            return string.Format(
                "AUDIT LOG: {0}.{1} is executed by user {2} in {3} ms from {4} IP address.",
                ServiceName, MethodName, UserId, Duration, ClientIpAddress
                );
        }
    }
}