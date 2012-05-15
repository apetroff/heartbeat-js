Ext.define('Ria.mt.Gestures', {
	extend: 'Ext.Base',

	constructor: function (config) {
		this.callParent(arguments);

		document.body.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		});
	},

	gestures: {
		tap: {
			add: function (el, fn) {
				var MAX_DURATION = 1000;
				var MAX_X_DELTA = 10;
				var MAX_Y_DELTA = 10;

				var start, x, y;

				var handlers = {
					touchstart: function (e) {
						var touches = e.targetTouches;

						if (touches.length === 1) {
							var touch = touches[0];
							x = touch.pageX;
							y = touch.pageY;
							start = Date.now();
						} else {
							start = null;
						}
					},

					touchmove: function (e) {
						if (start) {
							var touches = e.targetTouches;
							var touch = touches[0];

							var xD = Math.abs(touch.pageX - x);
							var yD = Math.abs(touch.pageY - y);

							if (xD > MAX_X_DELTA || yD > MAX_Y_DELTA) {
								start = null;
							}
						}
					},

					touchend: function (e) {
						if (start && (Date.now() - start) <= MAX_DURATION) {
							start = null;
							fn.call(el, e);
						}
					}
				};

				var forAllHandlers = function (method) {
					Object.keys(handlers).forEach(function (type) {
						el[method](type, handlers[type], false); 
					});
				};

				this.remove = function () {
					forAllHandlers('removeEventListener');
				};

				forAllHandlers('addEventListener');
			}
		},

		scroll: {
			add: function (el, fn) {
				var startX, startY;

				var handlers = {
					touchstart: function (e) {
						startX = e.pageX;
						startY = e.pageY;
					},

					touchmove: function (e) {
						var deltaX = e.pageX - startX;
						var deltaY = e.pageY - startY;
						fn(e, deltaX, deltaY);
					}
				};

				var forAllHandlers = function (method) {
					Object.keys(handlers).forEach(function (type) {
						el[method](type, handlers[type], false); 
					});
				};

				this.remove = function () {
					forAllHandlers('removeEventListener');
				};

				forAllHandlers('addEventListener');
			}
		}
	},

	addListener: function (el, type, fn) {
		var gest = this.gestures[type];
		if (gest) {
			gest.add(el, fn);
		} else {
			throw new Error(type + ': no such gesture.');
		}
	},

	removeListener: function (el, type, fn) {
		var gest = this.gestures[type];
		if (gest) {
			gest.remove(el, fn);
		} else {
			throw new Error(type + ': no such gesture.');
		}
	},

	addScroll: function (el) {
		this.addListener(el, 'scroll', function (e, deltaX, deltaY) {
			el.scrollLeft += deltaX;
			el.scrollTop += deltaY;
			e.preventDefault();
		}, false);
	},

	_dont: function (e) {
		e.stopPropagation();
	},

	dontPropagate: function (el, events) {
		var dont = this._dont;
		events.forEach(function (name) {
			el.addEventListener(name, dont, false);
		});
	}
});