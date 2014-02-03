namespace CQRS.Domain
{
    #region << Using >>

    using System;
    using System.Diagnostics.CodeAnalysis;
    using Incoding.Data;
    using Incoding.EventBroker;
    using Incoding.Quality;
    using JetBrains.Annotations;

    #endregion

    [UsedImplicitly, Obsolete(ObsoleteMessage.ClassNotForDirectUsage, true), ExcludeFromCodeCoverage]
    public class AuditSubscriber : IEventSubscriber<OnAuditEvent>
    {
        #region Fields

        readonly IRepository repository;

        #endregion

        #region Constructors

        public AuditSubscriber(IRepository repository)
        {
            this.repository = repository;
        }

        #endregion

        #region IEventSubscriber<OnAuditEvent> Members

        public void Subscribe(OnAuditEvent @event)
        {
            this.repository.Save(new Audit { Message = @event.Message });
        }

        #endregion

        #region Disposable

        public void Dispose() { }

        #endregion
    }
}