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
	},

	initHtml: function () {
		this.setTemplate();
		this.bindEvents();
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
		var button = form.elements.activate;

		var reset = function () {
			form.removeEventListener('submit', onSubmit);

			if (button) {
				button.removeEventListener('click', onActivate);
			}

			self.setTemplate();
			self.bindEvents();
		};

		var onSubmit = function (e) {
			e.preventDefault();

			if (null == self.getUserId()) {
				var input = form.elements.login;
				var val = input && input.value;

				if (val) {
					self.setUserId(val);
					reset();
				}
			} else {
				self.removeUserId();
				reset();
			}
		};

		var onActivate = function (e) {
			e.preventDefault();

			window.hockey.activateBall(self.config.uid);
		};

		/* Bind form. */
		form.addEventListener('submit', onSubmit, false);

		/* Bind activate button. */
		button && button.addEventListener(
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
