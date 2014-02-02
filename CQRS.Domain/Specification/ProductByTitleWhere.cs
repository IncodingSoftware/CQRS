namespace CQRS.Domain
{
    using System;
    using System.Linq.Expressions;
    using Incoding;

    public class ProductByTitleWhere : Specification<Product>
    {
        readonly string title;

        public ProductByTitleWhere(string title)
        {
            this.title = title;
        }

        public override Expression<Func<Product, bool>> IsSatisfiedBy()
        {
            if (string.IsNullOrWhiteSpace(this.title))
                return null;

            return product => product.Title.Contains(this.title);
        }
    }
}