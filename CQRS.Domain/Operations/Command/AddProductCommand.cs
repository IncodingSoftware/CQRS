namespace CQRS.Domain
{
    #region << Using >>

    using Incoding.CQRS;

    #endregion

    public class AddProductCommand : CommandBase
    {
        #region Properties

        public string Title { get; set; }

        public string Price { get; set; }

        #endregion

        public override void Execute()
        {
            decimal dPrice = 0;
            decimal.TryParse(Price, out dPrice);

            Repository.Save(new Product
                                {
                                        Title = Title, 
                                        Price = dPrice
                                });
        }
    }
}