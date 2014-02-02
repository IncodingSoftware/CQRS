namespace CQRS.UI.Controllers
{
    using CQRS.Domain;
    using Incoding.MvcContrib.MVD;    

    public class DispatcherController : DispatcherControllerBase
    {
        public DispatcherController()
                : base(typeof(Bootstrapper).Assembly) { }
    }
}