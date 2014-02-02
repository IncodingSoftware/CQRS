namespace CQRS.Domain
{
    #region << Using >>

    using Incoding.Block.IoC;
    using Incoding.CQRS;
    using Incoding.Data;

    #endregion

    public class InitDataBaseSetUp : ISetUp
    {
        #region ISetUp Members

        public int GetOrder()
        {
            return 1;
        }

        public void Execute()
        {
            var manager = IoCFactory.Instance.TryResolve<IManagerDataBase>();
            if (!manager.IsExist())
            {
                manager.Drop();
                manager.Create();
            }
        }

        #endregion

        #region Disposable

        public void Dispose() { }

        #endregion
    }
}