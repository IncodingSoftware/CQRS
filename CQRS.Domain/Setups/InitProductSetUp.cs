namespace CQRS.Domain
{
    #region << Using >>

    using System.Linq;
    using Incoding.Block.IoC;
    using Incoding.CQRS;

    #endregion

    public class InitProductSetUp : ISetUp
    {
        #region ISetUp Members

        public int GetOrder()
        {
            return 2;
        }

        public void Execute()
        {
            var dispatcher = IoCFactory.Instance.TryResolve<IDispatcher>();
            if (dispatcher.Query(new GetEntitiesQuery<Product>()).Any())
                return;

            dispatcher.Push(new AddProductCommand
                                {
                                        Title = "Milk",
                                        Price = 10
                                });
            dispatcher.Push(new AddProductCommand
                                {
                                        Title = "Bred",
                                        Price = 5
                                });
            dispatcher.Push(new AddProductCommand
                                {
                                        Title = "Tea",
                                        Price = 25
                                });
        }

        #endregion

        #region Disposable

        public void Dispose() { }

        #endregion
    }
}