using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OnboardingTaskV3.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
        [Required, MaxLength(100)]
        public string Address { get; set; }

        public virtual List<Sale> Sales { get; set; }
    }
}