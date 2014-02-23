using System.Web;
using System.Web.Script.Serialization;

namespace MiniChat
{
	/// <summary>
	/// Summary description for ChatServer
	/// </summary>
	public class ChatServer : IHttpHandler
	{
		public bool IsReusable
		{
			get
			{
				return false;
			}
		}

		public void ProcessRequest(HttpContext context)
		{
			string data = context.Request.Form["data"];

			JavaScriptSerializer serializer = new JavaScriptSerializer();

			RequestData requestData = (RequestData)serializer.Deserialize(data, typeof(RequestData));

			context.Response.ContentType = "text/plain";
			context.Response.Write("Hello World");
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
		public string User
		{
			get;
			set;
		}

		public string Room
		{
			get;
			set;
		}

		public string Input
		{
			get;
			set;
		}
	}
}