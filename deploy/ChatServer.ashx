<%@ WebHandler Language="C#" Class="MiniChat.ChatServer" %>
namespace MiniChat
{
	using System.Collections.Generic;
	using System.IO;
	using System.Runtime.Serialization;
	using System.Runtime.Serialization.Json;
	using System.Text;
	using System.Web;

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
			ListenerRequest request = this.ReadRequest<ListenerRequest>(context);

			this.CheckRoom(request.Room);

			if (request.LastMessage == null)
			{
				ResponseData responseAll = new ResponseData(request);

				responseAll.MessageList = this.MessageQueue[request.Room].ToArray();

				this.WriteResponse(context, responseAll);

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

			ResponseData response = new ResponseData(request);
			response.MessageList = messageList.ToArray();

			this.WriteResponse(context, response);
		}

		private void SendMessageHandler(HttpContext context)
		{
			RequestData request = this.ReadRequest<RequestData>(context);

			Message message = new Message();

			message.ID = request.ID;
			message.UserName = request.UserName;
			message.MessageValue = request.MessageValue;

			this.CheckRoom(request.Room);
			this.MessageQueue[request.Room].Enqueue(message);

			ResponseData response = new ResponseData(request);
			response.ID = request.ID;
			response.MessageList = new Message[1];
			response.MessageList[0] = message;

			this.WriteResponse(context, response);
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

		private T ReadRequest<T>(HttpContext context)
		{
			string data = context.Request.Form["data"];

			T request = Deserialize<T>(data);

			return request;
		}

		private void WriteResponse(HttpContext context, ResponseData response)
		{
			string responseText = Serialize(response);

			context.Response.ContentType = "text/plain";
			context.Response.Write(responseText);
		}

		private static string Serialize<T>(T obj)
		{
			string result;

			using (MemoryStream memoryStream = new MemoryStream())
			{
				DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));

				serializer.WriteObject(memoryStream, obj);
				memoryStream.Position = 0;

				using (StreamReader streamReader = new StreamReader(memoryStream))
				{
					result = streamReader.ReadToEnd();
				}
			}

			return result;
		}

		private static T Deserialize<T>(string json)
		{
			T result;

			using (MemoryStream memoryStream = new MemoryStream(Encoding.Unicode.GetBytes(json)))
			{
				DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));

				memoryStream.Position = 0;
				result = (T)serializer.ReadObject(memoryStream);
			}

			return result;
		}
	}

	#region Response objects

	public class Message
	{
		private string id;
		private string userName;
		private string messageValue;

		public string ID
		{
			get
			{
				return this.id;
			}

			set
			{
				this.id = value;
			}
		}

		public string UserName
		{
			get
			{
				return this.userName;
			}

			set
			{
				this.userName = value;
			}
		}

		public string MessageValue
		{
			get
			{
				return this.messageValue;
			}

			set
			{
				this.messageValue = value;
			}
		}
	}

	public class ResponseData
	{
		private Message[] messageList;
		private string id;

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
			get
			{
				return this.id;
			}

			set
			{
				this.id = value;
			}
		}

		public Message[] MessageList
		{
			get
			{
				return this.messageList;
			}

			set
			{
				this.messageList = value;
			}
		}
	}

	#endregion Response objects

	#region Request objects

	/// <summary>
	/// requestType object on client
	/// </summary>
	public enum RequestType
	{
		Listener = 1,
		SendMessage = 2
	}

	public class BaseRequest : IIdentifier
	{
		private string id;
		private string room;

		public string ID
		{
			get
			{
				return this.id;
			}

			set
			{
				this.id = value;
			}
		}

		public string Room
		{
			get
			{
				return this.room;
			}

			set
			{
				this.room = value;
			}
		}
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
		private string lastMessage;

		public string LastMessage
		{
			get
			{
				return this.lastMessage;
			}

			set
			{
				this.lastMessage = value;
			}
		}
	}

	public class RequestData : BaseRequest
	{
		private string userName;
		private string messageValue;

		public string UserName
		{
			get
			{
				return this.userName;
			}

			set
			{
				this.userName = value;
			}
		}

		public string MessageValue
		{
			get
			{
				return this.messageValue;
			}

			set
			{
				this.messageValue = value;
			}
		}
	}

	#endregion Request objects
}