DOMready(function () {
	(function (window, document, undefined) {
		var listen = false;

		var output = h.getEl("output");
		var input = h.getEl("txtInput");
		var server = "ChatServer.ashx";

		var getInput = function () {
			return input.value;
		};

		h.addEventListener(input, "keyup", function (e) {
			var key = e.which || e.keyCode;
			if (e.which == h.keys.Enter) {
				sendCommand();
			}
		});

		function sendCommand() {
			var response = h.requestGet(server, { method: "methodName", data: "some data" }, callback);
		}

		function callback(e) {
			console.log(e.data);
		}
	} (window, document));
});