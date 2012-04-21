Ext.define('Spief.controller.User', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			userButton: 'userPanel button',
			
			userForm: 'userForm',
			userLoginButton: 'userForm button[ui=confirm]',
			userCancelButton: 'userForm button[ui=decline]'
		},
		
		control: {
			userButton: {
				tap: 'onUserButtonTap'
			},
			userLoginButton: {
				tap: 'onUserButtonTap'
			},
			userCancelButton: {
				tap: 'onUserButtonTap'
			}
		}
	},

	onUserButtonTap: function( b, e, eOpts ) {

		if (this.getUserForm().getHidden()) {
			this.getUserForm().show();
		} else {
			this.getUserForm().hide();
		}
	}
});
