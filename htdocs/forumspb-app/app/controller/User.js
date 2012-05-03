Ext.define('Spief.controller.User', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			userButton: 'userPanel button',
			
			loginForm: 'userLogin',
			loginFieldset: 'userLogin fieldset',
			loginOkButton: 'userLogin button[ui=confirm]',
			loginCancelButton: 'userLogin button[ui=decline]',
			
			accountForm: 'userAccount',
			accountFieldset: 'userAccount fieldset',
			accountOkButton: 'userAccount button[ui=confirm]',
			accountCancelButton: 'userAccount button[ui=decline]'
		},
		
		control: {
			userButton: {
				activate: 'onUserButtonActivate',
				tap: 'onUserButtonTap'
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
			accountOkButton: {
				tap: 'onAccountOkTap'
			},
			accountCancelButton: {
				tap: 'onAccountCancelTap'
			}
		}
	},
	
	onUserButtonActivate: function() {
		
		if (!this.userButtonActivated) {
		
			this.userButtonActivated = true;
		
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
		
		this.setUserProfile(profile);
		this.setState('accountLoading');
		this.getAccount();
	},
	
	setUserProfile: function(profile) {
		
		var userModel = Spief.userModel;
		
		userModel.setData({
			_id: profile._id,
			username: profile.name,
			role: 'user'
		});
		
		this.setState('authorized');
	},
	
	onUserProfileFailed: function(error) {
		console.log ('Profile has not been recieved. Cause: ' + error.err);
	},
	
	onUserButtonTap: function( b, e, eOpts ) {

		if (Spief.userModel.get('role') == 'anonymous') {
		
			this.getLoginForm().show();
		
		} else {
		
			this.getAccountForm().show();
			this.getAccountForm().setRecord(Spief.accountModel);
			
		}
	},
	
	onLoginOkTap: function( b, e, eOpts ) {

		var form = this.getLoginForm();
		
		form.updateRecord(Spief.userModel);
		
		var errors = Spief.userModel.validate();
		
		if (errors.length >0) {
		
			this.setLoginStatus(errors, true);
		
		} else {
		
			this.login();
		}
	},
	
	onLoginCancelTap: function( b, e, eOpts ) {
		
		//reset and hide
		var loginFieldset = this.getLoginFieldset();
		loginFieldset.setInstructions(loginFieldset.defaultInstructions);
		
		this.getLoginForm().reset();
		this.getLoginForm().hide();
	},
	
	onAccountOkTap: function( b, e, eOpts ) {

		this.logout();
	},
	
	onAccountCancelTap: function( b, e, eOpts ) {
		
		this.getAccountForm().hide();		
	},
	
	onLoginSuccess: function(form, result, createAccount) {
		
		this.setUserProfile(result.data[0]);
		this.setState('accountLoading');
		this.getAccount(createAccount);
		
		form.reset();
		form.hide();
	},
	
	onLoginFailure: function(form, result) {
		
		if (result.status == 401) {
		
			switch (result.errCode) {
				case 1: //User not found
				{
					this.registration();
				}
				break;
				case 2: //Invalid password
				{
					this.setLoginStatus(['Пароль не соответсвует введенному при регистрации'], true);
				}
				break;
				case 3: //User already exist
				{
					this.setLoginStatus(['Unknown error'], true);
				}
				break;
			}
		}
	},
	onLogoutSuccess: function() {
		
		Spief.userModel.reset();
		Spief.accountModel.reset();
		
		this.setState('unauthorized');
		this.getAccountForm().hide();
	},
	
	onLogutFailure: function() {
		
		this.setLogoutStatus(['Ошибка сервера'], true);
	},
	
	////////////////////////////////////////////////////////////////////////
	
	setState: function(state) {
		
		var button = this.getUserButton();
		
		switch (state) {
			case 'unauthorized':
			{
				button.setIconCls('lock_closed');
				
				this.getAccountFieldset().setTitle('');
			}
			break;
			case 'accountLoading':
			{
				button.setDisabled(true);
			}
			break;
			case 'accountLoaded':
			{
				button.setDisabled(false);
			}
			break;
			case 'authorized':
			{
				var userModel = Spief.userModel,
					username = userModel.get('username');
					
				username = username[0].toUpperCase() + username.substring(1);
				
				button.setIconCls('user');
				
				this.getAccountFieldset().setTitle(username);
			}
			break;
		}
	},
	
	setLoginStatus: function(arr, err) {
			
			var loginFieldset = this.getLoginFieldset();
			loginFieldset.setInstructions(this.prepareStatus(arr,err));
	},
	
	setLogoutStatus: function(arr, err) {
				
			var logoutFieldset = this.getLogoutFieldset();
			logoutFieldset.setInstructions(this.prepareStatus(arr,err));
	},
	
	prepareStatus: function(arr, err) {
		
		var msg = '<ul ';
		if (err) msg += 'class="errors"';
		msg += '>';

		var method = (arr.join) ? 'forEach' : 'each';
		
		arr[method](function(item) {
			msg += '<li>';
			msg += item.getMessage ? item.getMessage() : item;
			msg += '</li>';
		});

		msg += '</ul>';
		
		return msg;
	},
	
	login: function() {
		
		var form = this.getLoginForm();
		
		form.submit({
			url: '/basic/login',
			scope: this,
			success: function(form, result) {
				if (result.err) this.onLoginFailure(form, result);
				else this.onLoginSuccess(form, result);
			},
			failure: this.onLoginFailure
		});
	},
	
	registration: function() {
		
		var form = this.getLoginForm();
		
		form.submit({
			url: '/basic/registration',
			scope: this,
			success: function(form, result) {
				if (result.err) this.onLoginFailure(form, {status: 502});
				else this.onLoginSuccess(form, result, true);
			},
			failure: this.onLoginFailure
		});
	
	},
	
	logout: function() {
		
		Ext.Ajax.request({
			url: '/logout',
			scope: this,
			
			success: this.onLogoutSuccess,			
			failure: this.onLogoutFailure
		});
	},
	
	getAccount: function(createAccount) {
		
		var accountModel = Spief.accountModel;
		
		if (createAccount) {
		
			accountModel.set({cache: 100000, packageCount: 0, actives: 100000});
			
			accountModel.save({
				
				success: function(record, operation) {
					
					var data = Ext.decode(operation.getResponse().responseText).data[0];
					accountModel.set(data);
					accountModel.commit(true);
					this.setAccount(record);
				},
				
				failure: function() {
					console.log(arguments);
				}
				
			}, this);
		
		} else {
			
			Ext.Ajax.request({
				url: '/entity/accounts/list.json',
				scope: this,
				success: function(response, opt) {
					
					var data = {};
					
					try {
						data = JSON.parse(response.responseText);
					} catch (e) {
						data.err = e;
					}
					
					if (!data.err && data.data && data.data.length == 1) {
						data = data.data[0];
						accountModel.set(data);
						accountModel.commit(true);
						this.setAccount(accountModel);
					} else {
						console.log(arguments);
					}
				},
				
				failure: function(response, opt) {
					console.log(arguments);
				}
				
			});
		}
	},
	
	setAccount: function(record) {
		
		this.getAccountForm().setRecord(Spief.accountModel);
		this.setState('accountLoaded');
		
	}
});
