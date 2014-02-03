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

    public class Audit : IncEntityBase
    {
        #region Properties

        public virtual string Message { get; set; }

        #endregion

        #region Nested classes

        [UsedImplicitly, Obsolete(ObsoleteMessage.ClassNotForDirectUsage, true), ExcludeFromCodeCoverage]
        public class Map : ClassMap<Audit>
        {
            ////ncrunch: no coverage start
            #region Constructors

            protected Map()
            {
                Table("Audit");
                Id(r => r.Id).CustomType<string>().GeneratedBy.Custom(typeof(GuidStringGenerator)).Length(36);
                Map(r => r.Message);
            }

            #endregion

            ////ncrunch: no coverage end        
        }

        #endregion
    }
}