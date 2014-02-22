using System.Web;

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
			context.Response.ContentType = "text/plain";
			context.Response.Write("Hello World");
		}
	}
}