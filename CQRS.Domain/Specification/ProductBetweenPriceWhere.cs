namespace CQRS.Domain
{
    using System;
    using System.Linq.Expressions;
    using Incoding;

    public class ProductBetweenPriceWhere : Specification<Product>
    {
        readonly decimal? to;

        readonly decimal? @from;

        public ProductBetweenPriceWhere(decimal? @from, decimal? to)
        {
            this.to = to;
            this.@from = @from;
        }

        public override Expression<Func<Product, bool>> IsSatisfiedBy()
        {
            if (!this.to.HasValue && !this.@from.HasValue)
                return null;

            return product => (!this.to.HasValue || product.Price >= this.to) &&
                              (!this.@from.HasValue || this.@from >= product.Price);
        }
    }
}