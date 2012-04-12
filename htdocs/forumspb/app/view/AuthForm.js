Ext.define('Ria.view.AuthForm', {
    extend: 'Ext.Panel',
    xtype : 'authform',

	unauthedTpl: new Ext.XTemplate(
		'<form class="login" action="javascript:">',
		'<input name="login" type="text"',
		    ' autocomplete="off"',
		    ' placeholder="ID" required="required" />',
		'<button type="submit">Играть</button>',
		'</form>'
	).compile(),

	authedTpl: new Ext.XTemplate(
		'<form class="logout" action="javascript:">',
		'<input name="login" type="text" readonly="readonly" value="{userId}" />',
		'<button type="submit">Не играть</button>',
		'</form>'
	).compile(),

	initialize: function () {
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

		form.addEventListener('submit', function (e) {
			e.preventDefault();

			if (self.getUserId()) {
				self.removeUserId();
			} else {
				self.setUserId(this.elements.login.value);
			}

			self.setTemplate();
		}, false);
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
	},

	getUserId: function () {
		return window.localStorage.getItem(
			'user-space-' + this.config.uid
		);
	}
});
