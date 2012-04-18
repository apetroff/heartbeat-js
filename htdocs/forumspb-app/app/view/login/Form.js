Ext.define('Spief.view.login.Form', {
	
	extend: 'Ext.form.Panel',
	xtype: 'loginForm',

	config: {
		right: 5,
		cls: 'login',
		width: 300,
		scrollable: false,
		hidden: true,
		
		layout: 'vbox',
		
		items: [
			{
				xtype: 'fieldset',
				items: [{
					xtype: 'textfield',
					placeHolder: 'Имя',
					name: 'name'
				},
				{
					xtype: 'textfield',
					placeHolder: 'Промо код',
					name: 'code'
				}]
			},
			{
				xtype: 'button',
				ui: 'confirm',
				text: 'Login'
			}
		]
	}
 });