DOMready(function () {
	(function (window, document, undefined) {
		var username, room;

		// DOM elements
		var output = h.getEl("output");
		var input = h.getEl("txtInput");
		var btnEnter = h.getEl("btnEnter");

		var messageTemplate = '<div><b style="margin-right: 3px;">{{UserName}}:</b><span id="{{ID}}">{{MessageValue}}</span></div>';

		// Configuration
		var serverUrl = "ChatServer.ashx";
		var listenerParam = "?t=1";
		var sendMessageParam = "?t=2";
		var lastMessage = null;

		var getInput = function () {
			return input.value;
		};

		var listener = new h.Listener(1000, function () {
			var url = serverUrl + listenerParam;
			h.requestGet(url,
			{
				"LastMessage": lastMessage,
				"Room": room
			},
			callback);
		});

		(function Main() {
			//username = prompt("Choose your nickname:", "");

			username = 'test';

			if (!username) {
				return;
			}

			room = url("?room");

			listener.start();

			input.disabled = false;
			btnEnter.disabled = false;

			h.addEventListener(input, "keyup", function (e) {
				var key = e.which || e.keyCode;
				if (e.which == h.keys.Enter) {
					sendCommand();
				}
			});

			h.addEventListener(btnEnter, "click", function () {
				sendCommand();
			});
		}());

		// Functions
		function sendCommand() {
			var requestData = {
				"UserName": username,
				"Room": room,
				"MessageValue": getInput()
			};

			input.value = "";

			var url = serverUrl + sendMessageParam;

			h.requestGet(url, requestData, callback);
		}

		// callback from Listener
		function callback(e) {
			if (e.MessageList.length == 0) {
				return;
			}

			var message = e.MessageList[e.MessageList.length - 1];

			for (var i = 0; i < e.MessageList.length; i++) {
				addMessage(e.MessageList[i]);
			}

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