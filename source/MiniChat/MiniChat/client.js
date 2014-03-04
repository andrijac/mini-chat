DOMready(function () {
	(function (window, document, undefined) {
		//============================================
		//=========== VAR ============================
		//============================================

		// State
		var username,
			room,
			lastMessage = null,

			// DOM elements
			output = h.getEl("output"),
			input = h.getEl("txtInput"),
			btnEnter = h.getEl("btnEnter"),

			// message output html template
			messageTemplate = '<div><b style="margin-right: 3px;">{{UserName}}:</b><span id="{{ID}}">{{MessageValue}}</span></div>',

			// Constants
			requestType = {
				listener: 1,
				sendMessage: 2
			},

			// Configuration
			serverUrl = "ChatServer.ashx",

			listener = new h.Listener(1000, function () {
				sendRequest({
					"LastMessage": lastMessage
				},
				requestType.listener,
				callback);
			});

		//============================================

		//function ExecInfo() {
		//	this.url = "";
		//	this.requestData = null;
		//	this.callback = null;
		//}

		//============================================

		(function Main() {
			//username = prompt("Choose your nickname:", "");

			username = 'test';

			if (!username) {
				return;
			}

			// read room from query string
			room = h.readQuery("?room");

			// start listener
			listener.start();

			// enable controls
			input.disabled = false;
			btnEnter.disabled = false;

			// add ENTER keyup event handler on Input field
			h.addEventListener(input, "keyup", function (e) {
				var key = e.which || e.keyCode;
				if (e.which == h.keys.Enter) {
					sendMessage();
				}
			});

			// add Click event handler on button
			h.addEventListener(btnEnter, "click", function () {
				sendMessage();
			});
		}());

		//============================================
		//=========== FUNCTIONS ======================
		//============================================

		// Functions
		function sendMessage() {
			var requestData = {
				"UserName": username,
				"MessageValue": input.value
			};

			input.value = "";

			sendRequest(requestData, requestType.sendMessage, callback);
		}

		function sendRequest(data, commandParam, callback) {
			var url,
				param,
				requestData;

			requestData = h.deepExtend({
				"ID": h.guid(),
				"Room": room,
			}, data);

			param = (serverUrl.indexOf("?") == -1 ? "?" : "&") + "t=" + (commandParam + '');

			url = serverUrl + param;

			h.requestGet(url, requestData, callback);
		}

		// callback from Listener
		function callback(e) {
			var message, i;

			if (e.MessageList.length == 0) {
				return;
			}

			for (i = 0; i < e.MessageList.length; i++) {
				addMessage(e.MessageList[i]);
			}

			message = e.MessageList[e.MessageList.length - 1];

			if (!!message) {
				lastMessage = message.ID;
			}
		}

		// add message to output container
		function addMessage(message) {
			var result = h.executeTemplate(message, messageTemplate);

			output.innerHTML += result;
		}
	}(window, document));
});