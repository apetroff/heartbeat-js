Ext.define('Spief.controller.User', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			userButton: 'userPanel button',
			
			loginForm: 'userLogin',
			loginFieldset: 'userLogin fieldset',
			loginOkButton: 'userLogin button[ui=confirm]',
			loginCancelButton: 'userLogin button[ui=decline]',
			
			logoutForm: 'userLogout',
			logoutOkButton: 'userLogout button[ui=confirm]',
			logoutCancelButton: 'userLogout button[ui=decline]'
		},
		
		control: {
			userButton: {
				tap: 'onUserButtonTap',
				activate: 'onUserButtonActivate'
			},
			loginForm: {
				initialize: 'onLoginFormInitialize'
			},
			loginOkButton: {
				tap: 'onLoginOkTap'
			},
			loginCancelButton: {
				tap: 'onLoginCancelTap'
			},
			logoutOkButton: {
				tap: 'onLoginOkTap'
			},
			logoutCancelButton: {
				tap: 'onLoginCancelTap'
			}
		}
	},
	
	constructor: function(config) {
        this.callParent(arguments);

		Spief.userModel = Ext.create('Spief.model.User', {role: 'anonymous'});
		
	},
	
	onUserButtonActivate: function() {
		
		if (!this.profileChecked) {
			
			this.profileChecked = true;
			
			// check profile by stoken
			
			Ext.Ajax.request({
				url: '/profile',
				scope: this,
				
				success: function(response, opts) {
					var data = Ext.decode(response.responseText);
					if (data.err || data.role && data.role == 'anonymous' || (data.statusCode && data.statusCode != 200)) {
						this.onUserProfileFailed(data);
					} else {
						this.onUserProfileRecieved(data);
					}
				},
				failure: function(response, opts) {
					this.onUserProfileFailed({statusCode: response.status, err: response.statusText});
				}
			});
		}
	},
	
	onLoginFormInitialize: function() {
		
		if (!this.loginFormInitialized) {
			this.loginFormInitialized = true;
			
			var loginFieldset = this.getLoginFieldset();
			loginFieldset.defaultInstructions = loginFieldset.getInstructions()._title;
		}
			
	},
	
	onUserProfileRecieved: function(profile) {
		
		var userModel = Spief.userModel;
		
		userModel.setData({
			_id: profile._id,
			username: profile.name,
			role: 'user'
		});
		
		var button = this.getUserButton();
		
		button.setText(profile.name);
		button.setIconCls('user');
		//TODO: change interface and get account data
	},
	
	onUserProfileFailed: function(error) {
		console.log ('Profile has not been recieved. Cause: ' + error.err);
	},
	
	onUserButtonTap: function( b, e, eOpts ) {

		if (Spief.userModel.get('role') == 'anonymous') {
		
			this.getLoginForm().show();
		
		} else {
		
			this.getLogoutForm().show();
			
		}
	},
	
	onLoginOkTap: function( b, e, eOpts ) {

		var form = this.getLoginForm();
		
		form.updateRecord(Spief.userModel);
		
		var errors = Spief.userModel.validate();
		
		if (errors.length >0) {
		
			var msg = '<ul class="errors">';
		
			errors.each(function(error) {
				msg += '<li>'+error.getMessage()+'</li>';
			});
			
			msg += '</ul>';
			
			var loginFieldset = this.getLoginFieldset();
			loginFieldset.setInstructions(msg);
		
		} else {
		
			form.submit({
				url: '/basic/login',
				scope: this,
				success: function(form, result) {
					if (result.err) this.onLoginFailure(form, result);
					else this.onLoginSuccess(form, result);
				},
				failure: this.onLoginFailure
			});
		}
	},
	
	onLoginCancelTap: function( b, e, eOpts ) {
		
		//reset and hide
		var loginFieldset = this.getLoginFieldset();
		loginFieldset.setInstructions(loginFieldset.defaultInstructions);
		
		this.getLoginForm().reset();
		this.getLoginForm().hide();
	},
	
	onLogoutOkTap: function( b, e, eOpts ) {

		this.logout();
	},
	
	onLogoutCancelTap: function( b, e, eOpts ) {
		
		this.getLogoutForm().hide();
		
	},
	
	onLoginSuccess: function(form, result) {
		this.onUserProfileRecieved(result.data[0]);
		this.onLoginCancelTap();
	},
	
	onLoginFailure: function(form, result) {
		
		console.log('failure', form, result);
		
		if (result.status == 401) {
			
			form.submit({
				url: '/basic/registration',
				scope: this,
				success: function(form, result) {
					if (result.err) this.onLoginFailure(form, {status: 502});
					else this.onLoginSuccess(form, result);
				},
				failure: this.onLoginFailure
			});
			
		}
	}
	
	
});
