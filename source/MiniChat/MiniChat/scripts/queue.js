(function (window) {
	function Queue() {
		this.collection = [];
	}

	Queue.prototype = {
		enqueue: function (obj) {
			queue.push(obj);
		},
		dequeue: function () {
			queue.shift();
		},
		getCollection: function () {
			return this.collection;
		}
	}

	window.Queue = Queue;
}(window));