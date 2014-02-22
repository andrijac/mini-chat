var h = (function () {
	return {
		getAjax: getAjax,
		addEventListener: addEventListener
	};

	function getAjax() {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest;
		} else {
			try {
				return new ActiveXObject("MSXML2.XMLHTTP.3.0");
			} catch (ex) {
				return null;
			}
		}
	};

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
})()