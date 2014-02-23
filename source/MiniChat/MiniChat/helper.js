﻿var h = (function () {
	var keys = {
		Backspace: 8,
		Tab: 9,
		Enter: 13,
		Shift: 16,
		Ctrl: 17,
		Alt: 18,
		Pause: 19,
		Capslock: 20,
		Esc: 27,
		PageUp: 33,
		PageDown: 34,
		End: 35,
		Home: 36,
		LeftArrow: 37,
		UpArrow: 38,
		RightArrow: 39,
		DownArrow: 40,
		Insert: 45,
		Delete: 46,
		Zero: 48,
		One: 49,
		Two: 50,
		Three: 51,
		Four: 52,
		Five: 53,
		Six: 54,
		Seven: 55,
		Eight: 56,
		Nine: 57,
		a: 65,
		b: 66,
		c: 67,
		d: 68,
		e: 69,
		f: 70,
		g: 71,
		h: 72,
		i: 73,
		j: 74,
		k: 75,
		l: 76,
		m: 77,
		n: 78,
		o: 79,
		p: 80,
		q: 81,
		r: 82,
		s: 83,
		t: 84,
		u: 85,
		v: 86,
		w: 87,
		x: 88,
		y: 89,
		z: 90,
		Zero_numpad: 96,
		One_numpad: 97,
		Two_numpad: 98,
		Three_numpad: 99,
		Four_numpad: 100,
		Five_numpad: 101,
		Six_numpad: 102,
		Seven_numpad: 103,
		Eight_numpad: 104,
		Nine_numpad: 105,
		Star: 106,
		Plus: 107,
		Minus: 109,
		Dot: 110,
		Divide: 111,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		Equals: 187,
		Coma: 188,
		Slash: 191,
		Backslash: 220
	};

	var requestList = {};

	// http://www.impressivewebs.com/ajax-from-the-ground-up-part-1-xmlhttprequest/
	function getAjax() {
		var xhrObject = false;
		// Most browsers (including IE7) use the 3 lines below
		if (window.XMLHttpRequest) {
			xhrObject = new XMLHttpRequest();
		}
		// Internet Explorer 5/6 will use one of the following
		else if (window.ActiveXObject) {
			try {
				xhrObject = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (err) {
				try {
					xhrObject = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (err) {
					xhrObject = false;
				}
			}
		}
		return xhrObject;
	};

	function requestGet(url, data, callback) {
		var xmlHttp = getAjax();
		xmlHttp.onreadystatechange = requestGetCallback;
		xmlHttp.open("POST", url, true);

		var request = {
			ID: guid(),
			Data: data
		}

		var package = JSON.stringify(request);

		requestList[request.id] = callback;

		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		//		xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.send("data=" + encodeURIComponent(package));
	}

	function requestGetCallback(e) {
		if (e.readyState == 4) {
			var response = eval(e.responseText);

			requestList[response.id](response);

			delete requestList[response.id];
		}
	}

	function getEl(id) {
		return document.getElementById(id);
	}

	function addEventListener(obj, evt, fnc) {
		// W3C model
		if (obj.addEventListener) {
			obj.addEventListener(evt, fnc, false);
			return true;
		} else if (obj.attachEvent) { // Microsoft model
			return obj.attachEvent('on' + evt, fnc);
		} else { // Browser don't support W3C or MSFT model, go on with traditional
			evt = 'on' + evt;
			if (typeof obj[evt] === 'function') {
				// Object already has a function on traditional
				// Let's wrap it with our own function inside another function
				fnc = (function (f1, f2) {
					return function () {
						f1.apply(this, arguments);
						f2.apply(this, arguments);
					}
				})(obj[evt], fnc);
			}
			obj[evt] = fnc;
			return true;
		}
		return false;
	};

	var guid = (function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
		};
		return function () {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
		}
	} ());

	function Listener(interval, listenFunction) {
		this.ID = null;
		this.interval = interval;
		this.listenFunction = listenFunction;
	}

	Listener.prototype.start = function () {
		this.ID = setInterval(this.listenFunction, this.interval);
	};

	Listener.prototype.stop = function () {
		window.clearInterval(this.ID);
	};

	return {
		Listener: Listener,
		getAjax: getAjax,
		addEventListener: addEventListener,
		requestGet: requestGet,
		getEl: getEl,
		keys: keys
	};
})();