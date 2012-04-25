Ext.define('Spief.view.user.Login', {
	
	extend: 'Ext.form.Panel',
	xtype: 'userLogin',

	config: {
		cls: 'user',
		scrollable: false,
		
		modal: true,
		centered: true,
		hidden: true,
		
		width: 270,
		
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center'
		},
		
		items: [{
			xtype: 'fieldset',
			width: 230,
			title: 'Авторизация',
			instructions: 'Используйте код на обороте вашего бейджа',
			items: [{
				xtype: 'textfield',
				label: 'Имя',
				name: 'username'
			}, {
				xtype: 'passwordfield',
				label: 'Код',
				name: 'password'
			}]
		}, {
			xtype: 'container',
			layout: 'hbox',
			docked: 'bottom',
			defaults: {
				xtype: 'button',
				flex: 1
			},
			items: [{
				ui: 'confirm',
				text: 'Войти'
			}, {
				xtype: 'spacer',
				width: 5
			},{
				ui: 'decline',
				text: 'Отмена'
			}]
		}, {
			xtype: 'spacer',
			docked: 'bottom',
			height: 5
		}]
	}
});