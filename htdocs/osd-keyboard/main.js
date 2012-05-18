(function () {
	'use strict';

	var OsdKeyboard = {
		layouts: {
			numeric: [
				7, 8, 9, 4, 5, 6, 1, 2, 3,
				{ text: '⇤', value: 'backspace' },
				0,
				{ text: 'OK', value: 'enter' }
			]
		},

		prefix: 'osd-keyboard_',

		init: function (cfg) {
			this.cfg = cfg;

			this.createLayout();
			this.bind();
		},

		createLayout: function () {
			var layoutType = this.cfg.layoutType;
			var layout = this.cfg.layout || this.layouts[layoutType];
			var board = this.boardEl = document.createElement('div');

			for (var i = 0, len = layout.length; i < len; i++) {
				var key = layout[i];
				if ('object' == typeof key) {
					var value = key.value;
					var text = key.text || value;
				} else {
					text = value = key;
				}

				var keyEl = document.createElement('div');
				keyEl.classList.add(this.prefix + 'key');
				keyEl.classList.add(this.prefix + 'key_' + value);
				keyEl.setAttribute('data-' + this.prefix + 'key', value); 
				keyEl.textContent = text;
				board.appendChild(keyEl);
			}

			board.classList.add(this.prefix + 'board');
			board.classList.add(this.prefix + 'layout_' + layoutType);
			this.cfg.container.appendChild(board);
		},

		show: function () {
			this.boardEl.classList.add(this.prefix + 'visible');
		},

		hide: function () {
			this.boardEl.classList.remove(this.prefix + 'visible');
		},

		setPosition: function (pos) {
			var self = this;
			Object.keys(pos).forEach(function (k) {
				self.boardEl.style[k] = pos[k]  + 'px';
			});
		},

		bind: function () {
			var self = this;

			var onKeyDown = function (e) {
				var value = e.target.getAttribute(
					'data-' + self.prefix + 'key'
				);
				if (value) {
					self.emit(value);
				}
			};

			this.boardEl.addEventListener(
				'touchstart', onKeyDown, false
			);

			this.boardEl.addEventListener(
				'mousedown', onKeyDown, false
			);
		},

		emit: function (key) {
			// FIXME: inherit from emmiter
			this.cfg.onKeyDown(key);
		}
	};

	window.OsdKeyboard = OsdKeyboard;
}());