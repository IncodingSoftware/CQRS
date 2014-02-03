namespace CQRS.Domain
{
    #region << Using >>

    using Incoding.EventBroker;

    #endregion

    public class OnAuditEvent : IEvent
    {
        public string Message { get; set; }
    }
}