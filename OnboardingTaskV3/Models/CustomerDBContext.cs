using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace OnboardingTaskV3.Models
{
    public class CustomerDBContext : DbContext
    {
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Sale> Sales { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Sale>()
                .HasRequired(s => s.Store)
                .WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<Sale>()
                .HasRequired(s => s.Product)
                .WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<Sale>()
                .HasRequired(s => s.Customer)
                .WithMany().WillCascadeOnDelete(false);
        }
    }


}