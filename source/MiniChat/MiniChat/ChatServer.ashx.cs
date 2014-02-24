namespace MiniChat
{
	using System.Collections.Generic;
	using System.Web;
	using System.Web.Script.Serialization;

	/// <summary>
	/// Summary description for ChatServer
	/// </summary>
	public class ChatServer : IHttpHandler
	{
		public const string MessageQueueKey = "MessageQueue";

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}

		public Dictionary<string, Queue<Message>> MessageQueue
		{
			get
			{
				if (HttpContext.Current.Application[MessageQueueKey] == null)
				{
					HttpContext.Current.Application[MessageQueueKey] = new Dictionary<string, Queue<Message>>();
				}

				Dictionary<string, Queue<Message>> value = (Dictionary<string, Queue<Message>>)HttpContext.Current.Application[MessageQueueKey];

				return value;
			}
		}

		public void ProcessRequest(HttpContext context)
		{
			int requestTypeNumber;
			if (!int.TryParse(context.Request.QueryString["t"], out requestTypeNumber))
			{
				return;
			}

			RequestType requestType = (RequestType)requestTypeNumber;

			switch (requestType)
			{
				case RequestType.Listener:
					this.ListenerHandler(context);
					break;

				case RequestType.SendMessage:
					this.SendMessageHandler(context);
					break;
			}
		}

		private void ListenerHandler(HttpContext context)
		{
			JavaScriptSerializer serializer = new JavaScriptSerializer();

			ListenerRequest request = this.ReadRequest<ListenerRequest>(context, serializer);

			this.CheckRoom(request.Room);

			if (request.LastMessage == null)
			{
				ResponseData responseAll = new ResponseData(request)
				{
					MessageList = this.MessageQueue[request.Room].ToArray()
				};

				this.WriteResponse(context, serializer, responseAll);

				return;
			}

			List<Message> messageList = new List<Message>();
			bool startCollect = false;

			foreach (Message message in this.MessageQueue[request.Room])
			{
				if (startCollect)
				{
					messageList.Add(message);
				}
				else if (message.ID == request.LastMessage)
				{
					startCollect = true;
				}
			}

			ResponseData response = new ResponseData(request)
			{
				MessageList = messageList.ToArray()
			};

			this.WriteResponse(context, serializer, response);
		}

		private void SendMessageHandler(HttpContext context)
		{
			JavaScriptSerializer serializer = new JavaScriptSerializer();

			RequestData request = this.ReadRequest<RequestData>(context, serializer);

			Message message = new Message()
			{
				ID = request.ID,
				UserName = request.UserName,
				MessageValue = request.MessageValue
			};

			this.CheckRoom(request.Room);
			this.MessageQueue[request.Room].Enqueue(message);

			ResponseData response = new ResponseData(request);
			response.ID = request.ID;
			response.MessageList = new Message[1];
			response.MessageList[0] = message;

			this.WriteResponse(context, serializer, response);
		}

		private bool CheckRoom(string roomId)
		{
			if (!this.MessageQueue.ContainsKey(roomId))
			{
				this.MessageQueue[roomId] = new Queue<Message>();
				return false;
			}

			return true;
		}

		private T ReadRequest<T>(HttpContext context, JavaScriptSerializer serializer)
		{
			string data = context.Request.Form["data"];

			T request = (T)serializer.Deserialize(data, typeof(T));

			return request;
		}

		private void WriteResponse(HttpContext context, JavaScriptSerializer serializer, ResponseData response)
		{
			string responseText = serializer.Serialize(response);

			context.Response.ContentType = "text/plain";
			context.Response.Write(responseText);
		}
	}

	public enum RequestType
	{
		Listener = 1,
		SendMessage = 2
	}

	public interface IIdentifier
	{
		string ID
		{
			get;
			set;
		}
	}

	public class ListenerRequest : BaseRequest
	{
		public string LastMessage
		{
			get;
			set;
		}
	}

	public class Message
	{
		public string ID
		{
			get;
			set;
		}

		public string UserName
		{
			get;
			set;
		}

		public string MessageValue
		{
			get;
			set;
		}
	}

	public class ResponseData
	{
		public ResponseData()
		{
		}

		public ResponseData(IIdentifier identifier)
			: base()
		{
			this.ID = identifier.ID;
		}

		public string ID
		{
			get;
			set;
		}

		public Message[] MessageList
		{
			get;
			set;
		}
	}

	public class RequestData : BaseRequest
	{
		public string UserName
		{
			get;
			set;
		}

		public string MessageValue
		{
			get;
			set;
		}
	}

	public class BaseRequest : IIdentifier
	{
		public string ID
		{
			get;
			set;
		}

		public string Room
		{
			get;
			set;
		}
	}
}