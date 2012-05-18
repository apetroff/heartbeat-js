Ext.define('Ria.view.AuthForm', {
    extend: 'Ext.Panel',
    xtype : 'authform',

	unauthedTpl: new Ext.XTemplate(
		'<form class="login" action="javascript:">',
		'<input name="login" type="text"',
		    ' autocomplete="off"',
		    ' placeholder="ID" />',
		'<button type="submit">Играть</button>',
		'</form>'
	).compile(),

	authedTpl: new Ext.XTemplate(
		'<form class="logout" action="javascript:">',
		'<label>{userId}</label>',
		'<button type="submit">Не играть</button>',
		'<button name="activate">Жетон</button>',
		'</form>'
	).compile(),

	initialize: function (index) {
		this.callParent(arguments);

		this.osdKeyboard = Object.create(window.OsdKeyboard);
		this.osdKeyboard.init({
			container: document.body,
			layoutType: 'numeric'
		});
	},

	initHtml: function () {
		this.setTemplate();
		this.bindEvents();

		this.osdKeyboard.boardEl.style.setProperty(
			'-webkit-transform',
			'rotate(' + this.config.angle + 'deg)'
		);
	},

	setTemplate: function () {
		var userId = this.getUserId();

		if (userId) {
			this.setHtml(
				this.authedTpl.apply({
					userId: userId
				})
			);
		} else {
			this.setHtml(this.unauthedTpl.apply({}));
		}
	},

	bindEvents: function () {
		var self = this;

		var form = this.element.dom.querySelector('form');
		var input = form.elements.login;
		var activateButton = form.elements.activate;

		var onSubmit = function (e) {
			e && e.preventDefault();

			if (null == self.getUserId()) {
				var val = input && input.value;

				if (val) {
					self.setUserId(val);
					reset();
				}
			} else {
				self.removeUserId();
				reset();
			}

			self.osdKeyboard.hide();
		};

		var onActivate = function (e) {
			e.preventDefault();

			window.hockey.activateBall(self.config.uid);
		};

		var onKeyDown = function (val) {
			if (Number(val) == val) {
				input.value += val;
			} else {
				if ('backspace' == val) {
					input.value = input.value.substring(1);
				} else if ('enter' == val) {
					onSubmit();
				}
			}
		};

		var onFocus = function (e) {
			self.osdKeyboard.cfg.onKeyDown = onKeyDown;
			self.osdKeyboard.show();

			var pos = input.getBoundingClientRect();

			switch (self.config.uid) {
				case 0:
					self.osdKeyboard.setPosition({
						left: pos.right,
						top: pos.bottom
					});
					break;
				case 1:
					self.osdKeyboard.setPosition({
						left: pos.left - self.osdKeyboard.boardEl.offsetWidth,
						top: pos.bottom
					});
					break;
				case 2:
					self.osdKeyboard.setPosition({
						left: pos.right,
						top: pos.top - self.osdKeyboard.boardEl.offsetHeight
					});
					break;
				case 3:
					self.osdKeyboard.setPosition({
						left: pos.left - self.osdKeyboard.boardEl.offsetWidth,
						top: pos.top - self.osdKeyboard.boardEl.offsetHeight
					});
					break;
			}
		};

		var onBlur = function (e) {
			//self.osdKeyboard.hide();
		};

		var reset = function () {
			form.removeEventListener('submit', onSubmit);

			if (activateButton) {
				activateButton.removeEventListener('click', onActivate);
			}

			if (input) {
				input.addEventListener('focus', onFocus, false);
				input.addEventListener('blur', onBlur, false);
			}

			self.setTemplate();
			self.bindEvents();
		};

		if (input) {
			input.addEventListener('focus', onFocus, false);
			input.addEventListener('blur', onBlur, false);
		}

		/* Bind form. */
		form.addEventListener('submit', onSubmit, false);

		/* Bind activate button. */
		activateButton && activateButton.addEventListener(
			'click', onActivate, false
		);
	},

	getUserId: function () {
		return window.localStorage.getItem(
			'user-space-' + this.config.uid
		);
	},

	setUserId: function (userId) {
		return window.localStorage.setItem(
			'user-space-' + this.config.uid,
			userId
		);
	},

	removeUserId: function () {
		return window.localStorage.removeItem(
			'user-space-' + this.config.uid
		);
	}
});
