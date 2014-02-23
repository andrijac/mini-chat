DOMready(function () {
	(function (window, document, undefined) {
		var username, room;

		// DOM elements
		var output = h.getEl("output");
		var input = h.getEl("txtInput");
		var btnEnter = h.getEl("btnEnter");

		var messageTemplate = '<div><span>{{UserName}}:</span><span id="{{ID}}">{{MessageValue}}</span></div>';

		// Configuration
		var server = "ChatServer.ashx";

		var getInput = function () {
			return input.value;
		};

		var listener = new h.Listener(1000, function () {
			// TODO: listen
		});

		(function Main() {
			//username = prompt("Choose your nickname:", "");

			username = 'test';

			if (!username) {
				return;
			}

			room = url("?room");

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
		} ());

		// Functions
		function sendCommand() {
			listener.stop();

			var requestData = {
				UserName: username,
				Room: room,
				MessageValue: getInput()
			};

			h.requestGet(server, requestData, callback);
		}

		function callback(e) {
			addMessage(e.Message);
			listener.start();
		}

		function addMessage(message) {
			var names = ["UserName", "ID", "MessageValue"];
			var result = '';

			for (var i = 0; i < names.length; i++) {
				result += messageTemplate.replace("\/{{" + names[i] + "\/}}", message[names[i]]);
			}

			output.innerHTML += result;
		}
	} (window, document));
});