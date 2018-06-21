using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnboardingTaskV3.Models;

namespace OnboardingTaskV3.Controllers
{
    public class SalesController : Controller
    {
        CustomerDBContext db = new CustomerDBContext();
        
        // GET: Sales
        public ActionResult Index()
        {

            return View();
        }

        public JsonResult SaleList()
        {
            var saleList = db.Sales.Include(c => c.Customer).Include(p => p.Product).Include(s => s.Store).Select(x => new
            {
                Id = x.Id,
                ProductId = x.Product.Id,
                Product = x.Product.Name,
                CustomerId = x.Customer.Id,
                Customer = x.Customer.Name,
                StoreId = x.Store.Id,
                Store = x.Store.Name,
                DateSold = x.DateSold.Month + "-" + x.DateSold.Day + "-" + x.DateSold.Year
            }).ToList();
            return Json(saleList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddSale(Sale sale)
        {
            var result = false;
            try
            {
                db.Sales.Add(sale);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateSale(Sale sale)
        {
            var result = false;
            try
            {
                db.Entry(sale).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteSale(Sale sale)
        {
            var result = false;
            try
            {
                db.Sales.Attach(sale);//If this is not included then exception error is thrown.
                db.Sales.Remove(sale);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCustomerReference(Customer customer)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.CustomerId == customer.Id);
            foreach (Sale sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteProductReference(Product product)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.ProductId == product.Id);
            foreach (Sale sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteStoreReference(Store store)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.StoreId == store.Id);
            foreach (Sale sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}