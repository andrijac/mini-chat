DOMready(function () {
	(function (window, document, undefined) {
		var listen = false;

		// DOM elements
		var output = h.getEl("output");
		var input = h.getEl("txtInput");
		var btnEnter = h.getEl("btnEnter");

		// Configuration
		var server = "ChatServer.ashx";

		var getInput = function () {
			return input.value;
		};

		var room = url("?room");

		var username = prompt("Choose your nickname:", "");

		if (!username) {
			return;
		}

		input.disabled = false;
		btnEnter.disabled = false;

		h.addEventListener(input, "keyup", function (e) {
			var key = e.which || e.keyCode;
			if (e.which == h.keys.Enter) {
				sendCommand();
			}
		});

		// Functions
		function sendCommand() {
			var requestData = {
				User: username,
				Room: room,
				Input: getInput()
			};

			h.requestGet(server, requestData, callback);
		}

		function callback(e) {
			console.log(e.data);
		}
	} (window, document));
});