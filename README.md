<p style="text-align: center;"><a href="http://blog.incframework.com/wp-content/uploads/2014/02/SkiDriver.png"><img class="wp-image-1271 aligncenter" src="http://blog.incframework.com/wp-content/uploads/2014/02/SkiDriver-1024x468.png" alt="Incoding CQRS vs NLayer" width="850" height="270" /></a></p>
<strong>Disclaimer</strong>: This article is the author’s personal opinion based on the experience and knowledge gained from creating projects.
<p style="text-align: center;"><strong>The way it used to beе</strong></p>
<del></del>In recent times the approach of complex n-layer architectures, which segregates an application into layers thus giving developers an option to work out elements of the project separately, has been most often used to develop the server-end of the
business applications.

Yet there are certain drawbacks:
<ul>
	<li>The “Expansion” of the initial code, the problem most commonly caused by adding linking layers like facade layer, communication layer.</li>
	<li> Concealing details behind a multitude of layers (the problem is thoroughlydescribed in the <a href="http://ayende.com/blog/35841/review-microsoft-n-layer-app-sample-part-x-architecture-for-the-space-age" target="_blank">article</a> ).</li>
</ul>
Within the n-layer systems the n-layer the service layer, which aims at concealing the details of the enterprise processes and application logic by aggregating similar tasks into one class, at the same time it springs the following problems:
<ul>
	<li>Difficulties in maintenance and expansion of closely connected methods (the problem will be considered in more detail in this article</li>
	<li>The increased complexity of the unit test creation unit test</li>
</ul>
Another reason for rejecting the n-layer may be considered to be the fact that after such Agile Software Development like Scrum, kanban have gained popularity it turned out that complex multilayer architectures feature a set of other problems::
<ul>
	<li>Complexity of the task decomposition due to the high layer coherence,which fact does not let to use the sprint.</li>
	<li>Abstractions between layers affects negatively the overall architecture transparency, thus hindering the developers' communication.</li>
</ul>
<p style="text-align: center;"><strong>Way to CQRS</strong></p>
<p style="text-align: left;">Software developers came to design of CQRS while solving a decomposition problem and also other problems described above. Therefore CQRS has been chosen as a basis of server architecture for Incoding Framework.</p>
<p style="text-align: left;">Incoding Framework CQRS is a set of basic and ready classes (command, query, dispatcher, Event broker) which completely cover the majority of wide-spread scenarios of business applications development..</p>
<p style="text-align: left;"><strong>Basic terms:</strong></p>

<ul>
	<li><strong>CommandBase</strong> - basic class for commands</li>
	<li><strong>QueryBase</strong> - basic class for queries</li>
	<li><strong>IEvent</strong> - event implementation</li>
	<li><strong>IEventSubscriber</strong> - implementation of event subscribers</li>
	<li><strong>DefaultDispatcher</strong> - default dispatcher for command and queries implementation</li>
	<li><strong>DefaultEventBroker</strong> - default broker for message publications</li>
</ul>
<em>Note: most Incoding Framework implementations can be substituted for your own with IoC.</em>

Key classes for developers are CommandBase и QueryBase, which feature the following instruments:
<ul>
	<li><a href="http://blog.incframework.com/en/repository" target="_blank">Repository</a>  - database level</li>
	<li><a href="http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern">EventBroker </a>- communication between separate application elements <em>
</em></li>
</ul>
<em>Note: the major difference between commands and queries when working with database is that queries never perform commit ( submit changes ) to the database while commands do..</em>

Further on in the article we are considering a solution for a typical task basing on the example of the API development for the Order creation, which is gradually getting more sophisticated, illustrating the advantages and disadvantages of various
approaches..

[wptabs]

[wptabtitle] Task 1 [/wptabtitle]

[wptabcontent]

<strong>Issue::  </strong>creation of order<strong>
</strong>

[wpspoiler name="Solution: service layer" ]
<pre class="toolbar:2 show-lang:2 lang:c# decode:true">public class OrderService:IOrderService
{
    IProductRepository productRepository;

    IUserRepository userRepository;

    public OrderService(IUserRepository userRepository,
                        IProductRepository productRepository)
    {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

   public void Add(AddOrderInput input)
   {
       using (var unitOfWork = UnitOfWorkFactory.Create())
       {
           try
           {
               var user = userRepository.Find(input.userId);
               var product = productRepository.Find(input.productId);
               user.AddOrder(new Order(product));

               unitOfWork.Commit()
           }
           catch (Exception)
           {               
               unitOfWork.RollBack()
               throw;
           }
       }
   }
}</pre>
<em>note: business logic</em>
<pre>public class OrderController
{
    IOrderService service;

    public OrderController(IOrderService service)
    {
        this.service = service;
    }

    public ActionResult Add(AddOrderInput input)
    {
        service.Add(input);
        return Redirect("success url");
    }

}</pre>
<em>note: use service</em>

[/wpspoiler]

[wpspoiler name="Solution: Incoding CQRS" ]
<pre class="lang:c# decode:true">public class AddOrderCommand : CommandBase
{
    public string UserId { get; set; }

    public string ProductId { get; set; }

    public override void Execute()
    {
        var user = Repository.GetById&lt;User&gt;(UserId);
        var product = Repository.GetById&lt;Product&gt;(ProductId);
        user.AddOrder(new Order(product));
    }
}</pre>
<em>note: business logic
</em>
<pre>public class OrderController
{
    IDispatcher dispatcher

    public OrderController(IDispatcher dispatcher)
    {
        this.dispatcher = dispatcher;
    }

    public ActionResult Add(AddOrderCommand input)
    {
        dispatcher.Push(input);        
        return Redirect("success url");
    }

}</pre>
<em>note: use command
</em>

[/wpspoiler]

Conclusion: implementation of the Incoding CQRS scores appreciably at the expense of:
<ul>
	<li>Provided infrastructure ( repository , dispatcher )</li>
	<li>A single execution point of all command и query, which makes redundant doubling the uniform code in multiple service method (like implementation of the Unit of work)</li>
</ul>
<em>Note : in case of services this is only possible when using AOP (Aspect oriented programming).</em>
<em>Note:the example code is prepared for creating UNIT TEST which is testified by introducing interactions into the class constructor which are supposed to be further substituted for place holders </em>
[/wptabcontent]

[wptabtitle] Task 2 [/wptabtitle]<strong>
</strong>

[wptabcontent]

<strong>Issue:  </strong>edition of order<strong>
</strong>

[wpspoiler name="Solution: service layer" ]
<pre class="lang:c# decode:true">public class OrderService : IOrderService
{
    IOrderRepository orderRepository;

    IProductRepository productRepository;

    IUserRepository userRepository;

    public OrderService(IOrderRepository orderRepository,
                        IUserRepository userRepository,
                        IProductRepository productRepository)
    {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

   public void Add(AddOrderInput input)
   {
       using (var unitOfWork = UnitOfWorkFactory.Create())
       {
           try
           {
               var user = userRepository.Find(input.userId);
               var product = productRepository.Find(input.productId);
               user.AddOrder(new Order(product));

               unitOfWork.Commit()
           }
           catch (Exception)
           {               
               unitOfWork.RollBack()
               throw;
           }
       }
   }

   public void Edit(EditOrderInput input)
   {
       using (var unitOfWork = UnitOfWorkFactory.Create())
       {
           try
           {
               var order = orderRepository.Find(input.Id);                  
               order.Product = productRepository.Find(input.productId);

               unitOfWork.Commit()
           }
           catch (Exception)
           {               
               unitOfWork.RollBack()
               throw;
           }
       }
   }
}</pre>
<em> note: business logic</em>
<pre class="lang:c# decode:true">public class OrderController
{
    IOrderService service;

    public OrderController(IOrderService service)
    {
        this.service = service;
    }

    public ActionResult Add(AddOrderInput input)
    {
        service.Add(input);
        return Redirect("success url");
    }  

    public ActionResult Edit(EditOrderInput input)
    {
        service.Edit(input);
        return Redirect("success url");
    }

}</pre>
<em> note: usage service</em>

[/wpspoiler]

[wpspoiler name="Solution: Incoding CQRS" ]
<pre>public class EditOrderCommand : CommandBase
{
    public string Id{ get; set; }

    public string ProductId { get; set; }

    public override void Execute()
    {
        var order = Repository.GetById&lt;Order&gt;(Id);
        order.Product = Repository.GetById&lt;Product&gt;(ProductId);
    }
}</pre>
<em>note: business logic</em>
<pre>public class OrderController
{
    IDispatcher dispatcher

    public OrderController(IDispatcher dispatcher)
    {
        this.dispatcher = dispatcher;
    }

    public ActionResult Add(AddOrderCommand input)
    {
        dispatcher.Push(input);        
        return Redirect("success url");
    }  

    public ActionResult Edit(EditOrderCommand input)
    {
        dispatcher.Push(input);        
        return Redirect("success url");
    }
}</pre>
<em>note: usage command
</em>

[/wpspoiler]

<strong>Conclusion: Task complication makes it obvious that the expansion of UserService class is made difficult as it is impossible to consider Add and Edit tasks separately (low segregation level) which consequently leads to the high level of elements coherence thus complicating the following:</strong>
<ul>
	<li>Altering one task skipping the others;</li>
	<li>Creating unit test (the example of the algorithm service layer demonstrates that it turned out necessary to add one more interface IOrderRepository in accordance with the constructor, although it is not used in the Add method)</li>
	<li>Responsibility distribution between the developers within the same group</li>
</ul>
[/wptabcontent]

[wptabtitle] Task 3 [/wptabtitle]<strong>
</strong>

[wptabcontent]

<strong>Issue:  </strong>sending an e-mail upon creating or editing order<strong>
</strong>

[wpspoiler name="solution: service layer" ]
<pre class="lang:c# decode:true">public class OrderService : IOrderService
{
    IOrderRepository orderRepository;

    IProductRepository productRepository;

    IUserRepository userRepository;

    IEmailSender emailSender;

    public OrderService(IOrderRepository orderRepository,
                        IUserRepository userRepository,
                        IProductRepository productRepository,
                        IEmailSender emailSender)
    {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.emailSender = emailSender;
    }

    public void Add(AddOrderInput input)
   {
       using (var unitOfWork = UnitOfWorkFactory.Create())
       {
           try
           {
               var user = userRepository.Find(input.userId);
               var product = productRepository.Find(input.productId);
               user.AddOrder(new Order(product));

               emailSender.Send(new EmailMessage()
                                    {
                                            Subject = "New"
                                    });
               unitOfWork.Commit()
           }
           catch (Exception)
           {               
               unitOfWork.RollBack()
               throw;
           }
       }
   }

    public void Edit(EditOrderInput input)
   {
       using (var unitOfWork = UnitOfWorkFactory.Create())
       {
           try
           {
               var order = rderRepository.Find(input.Id);                  
               order.Product = productRepository.Find(input.productId);

               emailSender.Send(new EmailMessage()
                                    {
                                            Subject = "Edit"
                                    });
               unitOfWork.Commit()
           }
           catch (Exception)
           {               
               unitOfWork.RollBack()
               throw;
           }
       }
   }
}</pre>
<em> note: business logic</em>

[/wpspoiler]

[wpspoiler name="Solution: Incoding CQRS" ]
<pre class="lang:c# decode:true">public class EditOrderCommand : CommandBase
{
    public string Id { get; set; }

    public string ProductId { get; set; }

    public override void Execute()
    {
        var order = Repository.GetById&lt;Order&gt;(Id);
        order.Product = Repository.GetById&lt;Product&gt;(ProductId);
        EventBroker.Publish(new SendEmail()
                                {
                                        Subject = "Edit"
                                });
    }
}</pre>
<pre class="lang:c# decode:true">public class AddOrderCommand : CommandBase
{
    public string UserId { get; set; }

    public string ProductId { get; set; }

    public override void Execute()
    {
        var user = Repository.GetById&lt;User&gt;(UserId);
        var product = Repository.GetById&lt;Product&gt;(ProductId);
        user.AddOrder(new Order(product));
        EventBroker.Publish(new SendEmail()
        {
            Subject = "Add"
        });
    }
}</pre>
<em> note: business logic</em>
<pre class="lang:c# decode:true">public  class SendEmail:IEvent
{
    public string Subject { get; set; }
}</pre>
<em> notes: events </em>
<pre class="lang:c# decode:true">public  class EmailSubscriber:IEventSubscriber&lt;SendEmail&gt;
{
    IEmailSender emailSender;

    public EmailSubscriber(IEmailSender emailSender)
    {
        this.emailSender = emailSender;
    }

    public void Handler(SendEmail @event)
    {
        emailSender.Send(new EmailMessage(){Subject = @event.Subject });
    }

}</pre>
<em> note: subscribers</em>

[/wpspoiler]

<strong>Conclusion: solution involving Incoding Framework may seem slightly more difficult due to responsibility segregation (saving in the database from sending e-mail), but this very characteristics allows testing each of the elements separately and reusing the events from various commands and queries. (In case of services this is achieved through inheritance, but faces a set of problems considered below in the conclusion to the paper)</strong>

<em>Note: only changes in services and commands running are described here, the controller remaining unchanged.
</em>

[/wptabs]
<p style="text-align: center;"><strong>Conclusion</strong></p>
Having considered the task solutions one may see than the cqrs approach (Incoding CQRS in particular) is more favorable for segregation of the tasks into smaller absolutely atomic (independent) blocks, than for any similar solutions based on
service layer implementation

The major reason for choosing Service layer is often the possibility to use the OOP, especially inheriting one service class from another one, thus extending functionality with general techniques, and giving the possibility to get rid of duplication. Consider GetUser or Get Staff techniques as examples. They can be used in most services and for this reason are included into the basic class UserServiceBase, from which specific implementations such as OrderService are inherited afterwards. However this approach features certain problems concerning maintenance of the inheritance in the subsequent application expansion, because either the subclasses won’t implement the techniques of the basic class or will introduce certain Boolean variables into their pattern (signature) or polymorphic overloading, thus leading to the following problems:
<ul>
	<li>Low method coherence within the class</li>
	<li>High level of complexity when altering or testing the code.</li>
</ul>
Under the module testing, task segregation into different classes can be distinguished, thus allowing independent task testing. Controller testing comes easier, taking just one parameter into the constructor (IDispatcher through which all the business logic of the application is processed).

Easy and comfortable communication with customers, as well as maintenance of the flexible methodologies of the implementation should also be pointed out to because of:
<ul>
	<li>Minor commands and query allow building up the sprint with high decomposition level.</li>
	<li>Commands and queries are a prototype of a business action, like “Add Order”, “Approve payment”, “Confirm user” or others.</li>
</ul>
<p style="text-align: left;">Bill of materials on CQRS</p>

<ul>
	<li><a title="Permanent Link: Clarified CQRS" href="http://www.udidahan.com/2009/12/09/clarified-cqrs/" rel="bookmark">Clarified CQRS</a></li>
	<li><a title="Permanent Link: Clarified CQRS" href="http://codebetter.com/gregyoung/2010/02/16/cqrs-task-based-uis-event-sourcing-agh/" rel="bookmark">CQRS, Task Based UIs, Event Sourcing agh!</a></li>
	<li><a href="http://cqrsguide.com/">CQRS guide </a></li>
</ul>
<p style="text-align: left;">Bill of materials on implementation of the Incoding Framework CQRS</p>

<ul>
	<li>Ready-made testing application  <a href="http://incmusicstore.incoding.biz/">IncMusicStore</a></li>
	<li>The Browsio project, which brings out its full potential</li>
	<li>Official documents</li>
	<li>Any questions are welcome in the comments to this topic or using contact details indicated on the site.</li>
</ul>
<strong>P.S.</strong> Incoding Framework CQRS has been tested for flexibility in various complicated business applications of the company.
