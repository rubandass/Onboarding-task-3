using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnboardingTaskV3.Models;

namespace OnboardingTaskV3.Controllers
{
    public class StoresController : Controller
    {
        CustomerDBContext db = new CustomerDBContext();

        // GET: Stores
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult StoreList()
        {
            var storeList = db.Stores.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(storeList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddStore(Store store)
        {
            var result = false;
            try
            {
                db.Stores.Add(store);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateStore(Store store)
        {
            var result = false;
            try
            {
                db.Entry(store).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {

                throw;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteStore(Store store)
        {
            var result = false;
            try
            {
                //db.Stores.Attach(store);//If this is not included then exception error is thrown.
                var deleteStore = db.Stores.Find(store.Id);
                db.Stores.Remove(deleteStore);
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