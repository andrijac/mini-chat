DOMready(function () {
	"use strict";
	(function (window, document, undefined) {
		//============================================
		//=========== VAR ============================
		//============================================

		// State
		var username,
			room,
			lastMessage = null,
			commands,
			listener,

			// DOM elements
			output = h.getEl("output"),
			input = h.getEl("txtInput"),
			btnEnter = h.getEl("btnEnter"),

			// message output html template
			messageTemplate = '<div><b style="margin-right: 3px;">{{UserName}}:</b><span id="{{ID}}" class="messageBody">{{MessageValue}}</span></div>',
			sysMessageTemplate = '<div><span class="sysMessageBody">{{MessageValue}}</span></div>',

			// Constants
			requestType = {
				listener: 1,
				sendMessage: 2
			},

			// Configuration
			serverUrl = "ChatServer.ashx";

		//============================================

		function Cmd(c, h) {
			this.cmd = c;
			this.handler = h;
		}

		commands = [
			new Cmd("nick", nickCommand)
		];

		//function ExecInfo() {
		//	this.url = "";
		//	this.requestData = null;
		//	this.callback = null;
		//}

		//============================================

		(function Main() {
			//username = prompt("Choose your nickname:", "");

			username = 'user';

			if (!username) {
				return;
			}

			listener = new h.Listener(1000, listenerHandler);

			// read room from query string
			room = h.readQuery("?room");

			// start listener
			window.l = listener;
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
			var inputVal = input.value.trim(),
				commandFind,
				requestData;

			if (!inputVal) return;

			commandFind = getCommand(inputVal)

			if (commandFind) {
				commandFind.cmd.handler(commandFind.value);
			}
			else {
				requestData = {
					"UserName": username,
					"MessageValue": inputVal
				};

				sendRequest(requestData, requestType.sendMessage, callback);
			}

			input.value = "";
		}

		function listenerHandler() {
			sendRequest({
				"LastMessage": lastMessage
			},
			requestType.listener,
			callback);
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
				addMessage(e.MessageList[i], messageTemplate);
			}

			message = e.MessageList[e.MessageList.length - 1];

			if (!!message) {
				lastMessage = message.ID;
			}
		}

		// add message to output container
		function addMessage(message, template) {
			var result = h.executeTemplate(message, template);

			output.innerHTML += result;
		}

		function getCommand(val) {
			if (!val
				|| val[0] != "/") return;

			var input = val.trim(),
				split = input.split(" "),
				command = split[0].substring(1),
				value = split[1].substring(0),
				returnCmd,
				returnValue;

			commands.forEach(function (e, i, array) {
				if (e.cmd == command) {
					returnCmd = e;
					returnValue = value;

					return true;
				}

				return false;
			})

			return {
				cmd: returnCmd,
				value: returnValue
			};
		}

		//============================================
		//=========== COMMANDS =======================
		//============================================

		function nickCommand(val) {
			if (!val) return;

			username = val.trim().split(" ")[0].trim();

			addMessage({
				"MessageValue": "username changed to '" + username + "'"
			}, sysMessageTemplate);
		}
	}(window, document));
});