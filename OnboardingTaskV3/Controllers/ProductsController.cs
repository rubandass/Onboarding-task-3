using OnboardingTaskV3.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OnboardingTaskV3.Controllers
{
    public class ProductsController : Controller
    {
        CustomerDBContext db = new CustomerDBContext();
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult ProductList()
        {
            var productList = db.Products.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price
            }).ToList();
            return Json(productList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddProduct(Product product)
        {
            var result = false;
            try
            {
                db.Products.Add(product);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateProduct(Product product)
        {
            var result = false;
            try
            {
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteProduct(Product product)
        {
            var result = false;
            try
            {
                db.Products.Attach(product);//If this is not included then exception error is thrown.
                db.Products.Remove(product);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {
                return Json("Error", JsonRequestBehavior.AllowGet);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}