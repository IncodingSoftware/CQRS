namespace CQRS.Domain
{
    using System.Collections.Generic;
    using System.Linq;
    using Incoding.CQRS;
    using Incoding.Extensions;

    public class GetProductsQuery : QueryBase<List<GetProductsQuery.Response>>
    {
        public class Response
        {
            public string Title { get; set; }

            public string Price { get; set; }
        }

        public string Title { get; set; }

        public decimal? From { get; set; }

        public decimal? To { get; set; }

        protected override List<Response> ExecuteResult()
        {
            return this.Repository.Query(whereSpecification: new ProductByTitleWhere(this.Title)
                                            .And(new ProductBetweenPriceWhere(this.From, this.To)))
                             .Select(product => new Response
                                                    {
                                                            Title = product.Title,
                                                            Price = product.Price.ToString("C")
                                                    })
                             .ToList();
        }
    }
}