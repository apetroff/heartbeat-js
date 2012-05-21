/* Disable gestures and context menu. */
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, false);

document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, false);

Ext.define('Ria.mt.Gestures', {
	extend: 'Ext.Base',

	constructor: function (config) {
		this.callParent(arguments);
	},

	gestures: {
		tap: {
			add: function (el, fn) {
				var MAX_DURATION = 1000;
				var MAX_X_DELTA = 50;
				var MAX_Y_DELTA = 50;

				var startId, startTime, x, y;

				var handlers = {
					touchstart: function (e) {
						var touches = e.targetTouches;
						if (touches.length === 1) {
							var touch = touches[0];
							x = touch.pageX;
							y = touch.pageY;
							startTime = Date.now();
							startId = touch.identifier;
						}
					},

					touchmove: function (e) {
						if (startId != null) {
							var touches = e.targetTouches;
							if (touches.length == 1) {
								var touch = touches[0];
								if (startId == touch.identifier) {
									var xD = Math.abs(touch.pageX - x);
									var yD = Math.abs(touch.pageY - y);

									if (xD > MAX_X_DELTA || yD > MAX_Y_DELTA) {
										startId = null;
									}
								}
							}
						}
					},

					touchend: function (e) {
						if (startId != null) {
							var touches = e.changedTouches;
							if (touches.length == 1) {
								var touch = touches[0];
								if (startId == touch.identifier) {
									startId = null;
									startTime = null;
									fn.call(el, e);
								}
							}
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
				var startX, startY, startId;

				var handlers = {
					touchstart: function (e) {
						var touches = e.targetTouches;
						if (touches.length == 1) {
							var touch = touches[0];
							startId = touch.identifier;
							startX = touch.pageX;
							startY = touch.pageY;
						}
					},

					touchmove: function (e) {
						if (startId != null) {
							var touches = e.targetTouches;
							if (touches.length == 1) {
								var touch = touches[0];
								if (startId == touch.identifier) {
									var deltaX = ~~(touch.pageX - startX);
									var deltaY = ~~(touch.pageY - startY);

									if (deltaX || deltaY) {
										fn(e, deltaX, deltaY);
									}
								}
							}
						}
					},

					touchend: function (e) {
						if (startId != null) {
							var touches = e.changedTouches;
							if (touches.length == 1) {
								var touch = touches[0];
								if (startId == touches.identifier) {
									startId = null;
								}
							}
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
		var handler = function (e, deltaX, deltaY) {
			el.scrollLeft -= deltaX;
			el.scrollTop  -= deltaY;
			e.preventDefault();
		};
		this.addListener(el, 'scroll', handler);
		return handler;
	},

	removeScroll: function (el, handler) {
		this.removeListener(el, 'scroll', handler);
	},

	_dont: function (e) {
		e.stopPropagation();
	},

	dontPropagate: function (el, events) {
		var dont = this._dont;
		events.forEach(function (name) {
			el.addEventListener(name, dont, false);
		});
	},

	restorePropagation: function (el, events) {
		var dont = this._dont;
		events.forEach(function (name) {
			el.removeEventListener(name, dont, false);
		});
	}
});