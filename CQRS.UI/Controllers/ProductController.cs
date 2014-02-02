namespace CQRS.UI.Controllers
{
    #region << Using >>

    using System.Web.Mvc;
    using CQRS.Domain;
    using Incoding.MvcContrib;

    #endregion

    public class ProductController : IncControllerBase
    {
        #region Http action

        [HttpGet]
        public ActionResult Add()
        {
            return IncView();
        }

        [HttpPost]
        public ActionResult Add(AddProductCommand input)
        {
            return TryPush(input);
        }

        [HttpGet]
        public ActionResult Fetch(GetProductsQuery query)
        {
            var vms = dispatcher.Query(query);
            return IncJson(vms);
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Template()
        {
            return IncPartialView("Product_Table_Tmpl");
        }

        #endregion
    }
}