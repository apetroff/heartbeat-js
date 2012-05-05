Ext.define('Spief.view.user.Account', {
	
	extend: 'Ext.form.Panel',
	xtype: 'userAccount',

	config: {
		cls: 'user',
		scrollable: false,
		
		modal: true,
		centered: true,
		hidden: true,
		
		width: 350,
		
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center'
		},
		
		items: [{
			xtype: 'fieldset',
			width: 330,
			title: '',
			instructions: 'Участвуйте в торгах, чтобы увеличить активы',
			
			defaults: {
				readOnly: true,
				labelWidth: 190,
			},
			
			items: [{
				xtype: 'numberfield',
				label: 'Оценка активов',
				inputCls: 'rur',
				name: 'actives'
			}, {
				xtype: 'numberfield',
				label: 'Кэш',
				inputCls: 'rur',
				name: 'cache'
			}, {
				xtype: 'numberfield',
				label: 'Пакетов акций',
				name: 'packageCount'
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
				text: 'Выйти'
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