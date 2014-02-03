namespace CQRS.Domain
{
    #region << Using >>

    using Incoding.CQRS;
    using Incoding.Extensions;

    #endregion

    public class AddProductCommand : CommandBase
    {
        #region Properties

        public string Title { get; set; }

        public decimal Price { get; set; }

        #endregion

        public override void Execute()
        {
            Repository.Save(new Product
                                {
                                        Title = Title, 
                                        Price = Price
                                });
            EventBroker.Publish(new OnAuditEvent
                                    {
                          Message = "New product {0} by {1}".F(Title, Price)
                                    });
        }
    }
}