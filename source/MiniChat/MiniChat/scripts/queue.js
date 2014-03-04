(function (window) {
	function Queue() {
		this.collection = [];
	}

	Queue.prototype = {
		enqueue: function (obj) {
			queue.push(obj);
		},
		dequeue: function () {
			return queue.shift();
		},
		getCollection: function () {
			return this.collection;
		},
		clear: function () {
			this.collection.length = 0;
		},
		containsItems: function () {
			return this.collection.length > 0;
		}
	}

	window.Queue = Queue;
}(window));