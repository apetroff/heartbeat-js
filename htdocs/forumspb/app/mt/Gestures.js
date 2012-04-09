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

				var start;

				var handlers = {
					touchstart: function (e) {
						if (e.targetTouches.length === 1) {
							start = Date.now();
						} else {
							start = null;
						}
					},

					touchmove: function (e) {
						if (start) {
							start = null;
						}
					},

					touchend: function (e) {
						if (start && Date.now() - start <= MAX_DURATION) {
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
			add: function (el, type) {
			},

			remove: function (el, type) {
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
	}
});