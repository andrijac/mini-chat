using System.Collections.Generic;
using System.Web;
using System.Web.Script.Serialization;

namespace MiniChat
{
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
			string data = context.Request.Form["data"];

			JavaScriptSerializer serializer = new JavaScriptSerializer();

			RequestData request = (RequestData)serializer.Deserialize(data, typeof(RequestData));

			Message message = new Message()
			{
				ID = request.ID,
				UserName = request.Data.UserName,
				MessageValue = request.Data.MessageValue
			};

			ResponseData response = new ResponseData();
			response.ID = request.ID;
			response.Message = message;

			string responseText = serializer.Serialize(response);

			context.Response.ContentType = "text/plain";
			context.Response.Write(responseText);
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
		public string ID
		{
			get;
			set;
		}

		public Message Message
		{
			get;
			set;
		}
	}

	public class RequestData
	{
		public string ID
		{
			get;
			set;
		}

		public InputData Data
		{
			get;
			set;
		}
	}

	public class InputData
	{
		public string UserName
		{
			get;
			set;
		}

		public string Room
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
}