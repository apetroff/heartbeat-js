Ext.define('Spief.controller.Login', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			loginButton: 'loginButton',
			loginForm: 'loginForm',
		},
		
		control: {
			loginButton: {
				tap: 'onLoginButtonTap'
			}
		}
	},

	onLoginButtonTap: function( b, e, eOpts ) {

		if (this.getLoginForm().getHidden()) {
			this.getLoginButton().setIconCls('user');
			this.getLoginForm().showBy(this.getLoginButton());
		} else {
			this.getLoginButton().setIconCls('lock_closed');
			this.getLoginForm().hide();
		}
	}
});
