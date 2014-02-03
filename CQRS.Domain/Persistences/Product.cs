namespace CQRS.Domain
{
    #region << Using >>

    using System;
    using System.Diagnostics.CodeAnalysis;
    using FluentNHibernate.Mapping;
    using Incoding.Data;
    using Incoding.Quality;
    using JetBrains.Annotations;

    #endregion

    public class Product : IncEntityBase
    {
        #region Properties

        public virtual string Title { get; set; }

        public virtual decimal Price { get; set; }

        #endregion

        #region Nested classes

        [UsedImplicitly, Obsolete(ObsoleteMessage.ClassNotForDirectUsage, true), ExcludeFromCodeCoverage]
        public class Map : ClassMap<Product>
        {
            ////ncrunch: no coverage start
            #region Constructors

            protected Map()
            {
                Table("Product");
                Id(r => r.Id).CustomType<string>().GeneratedBy.Custom(typeof(GuidStringGenerator)).Length(36);
                Map(r => r.Title);
                Map(r => r.Price);
            }

            #endregion

            ////ncrunch: no coverage end        
        }

        #endregion
    }
}