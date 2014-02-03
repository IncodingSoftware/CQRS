namespace CQRS.Domain
{
    #region << Using >>

    using System;
    using System.Linq.Expressions;
    using Incoding;

    #endregion

    public class ProductBetweenPriceWhere : Specification<Product>
    {
        #region Fields

        readonly decimal? to;

        readonly decimal? @from;

        #endregion

        #region Constructors

        public ProductBetweenPriceWhere(decimal? @from, decimal? to)
        {
            this.to = to;
            this.@from = @from;
        }

        #endregion

        public override Expression<Func<Product, bool>> IsSatisfiedBy()
        {
            if (!this.to.HasValue && !this.@from.HasValue)
                return null;

            return product => (!this.to.HasValue || product.Price <= this.to) &&
                              (!this.@from.HasValue || product.Price >= this.@from);
        }
    }
}