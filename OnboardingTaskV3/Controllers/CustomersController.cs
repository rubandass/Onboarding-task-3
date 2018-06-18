using OnboardingTaskV3.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OnboardingTaskV3.Controllers
{
    public class CustomersController : Controller
    {
        CustomerDBContext db = new CustomerDBContext();

        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CustomerList()
        {
            var customerList = db.Customers.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
            }).ToList();
            return Json(customerList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddCustomer(Customer customer)
        {
            var result = false;
            try
            {
                db.Customers.Add(customer);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateCustomer(Customer customer)
        {
            var result = false;
            try
            {
                db.Entry(customer).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCustomer(Customer customer)
        {
            var result = false;
            try
            {
                db.Customers.Attach(customer);//If this is not included then exception error is thrown.
                db.Customers.Remove(customer);
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