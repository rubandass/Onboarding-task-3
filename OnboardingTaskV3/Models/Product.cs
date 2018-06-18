using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace OnboardingTaskV3.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
        [Required, Column(TypeName="money")]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }
        public virtual List<Sale> Sales { get; set; }
    }
}