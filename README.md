CQRS
====

CQRS implementation is simpler than you thinked of it.

### Command

    public class ChangeStatusOrderCommand : CommandBase
    {  
      public string Id { get; set; }
      
      public OrderOfStatus Status { get; set; } 
      
      public override void Execute()
      {
         var order = Repository.GetById<Order>(Id);
         order.ChangeStatus(Status); 
         
         EventBroker.Publish(new OnRefresh()
         {
            Restaurant = order.Device.Restaurant.Name,
            Type = TypeOfPartSystem.Client
         });
         
       }  
    }
    
### QUERY

    public class GetGapsQuery : QueryBase<List<GetGapsQuery.Response>>
      {
        public Guid Status { get; set; }
        
        public bool ShowHistory { get; set; }
        
        public class Response 
        { 
         public string Type { get; set; }
         
         public string Status { get; set; }
         
         public bool Active { get; set; }
        }
        
        protected override List<Response> ExecuteResult()
        {
           return Repository
                .Query(whereSpecification: new GapByStatusOptWhereSpec(Status)
                                              .And(new ActiveEntityWhereSpec<Gap>(ShowHistory)))
                .ToList()                 
                .Select(gap => new Response
                                   {                                                            
                                           Type = gap.Type.Name,
                                           Active = gap.Active,
                                           Status = gap.Status.Name,                            
                                   })
                .ToList();
         }
         
       } 
      

#### Article 
* [CQRS vs Nlayer](http://blog.incframework.com/en/jqyery-style-vs-iml-style/)
* [CQRS extend course](http://blog.incframework.com/ru/cqrs-advanced-course/)
* [Repository](http://blog.incframework.com/ru/repository/)


#### Source code
* [Incoding Framework](https://github.com/IncodingSoftware/Incoding-Framework)
* [Repository](https://github.com/IncodingSoftware/Repository)
