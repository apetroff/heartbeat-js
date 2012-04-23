Ext.define('Spief.view.trade.Form', {
	
	extend: 'Ext.form.Panel',
	xtype: 'tradeForm',

	config: {
		
		cls: 'trade',
		
		scrollable: false,
		
		hidden: true,
		hideOnMaskTap: true,
		modal: true,
		centered: true,
		
		width: 500,
		
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center'
		},
		
		items: [{
			xtype: 'fieldset',
			width: 470,
			title: 'Покупка',
			instructions: 'Обменивайте свои активы на акции компаний',
			defaults: {
				labelWidth: 200
			},
			items: [{
				label: 'Количество акций',
				xtype: 'spinnerfield',
				groupButtons: false,
				minValue: 100,
				maxValue: 10000,
				increment: 100,
				defaultValue: 300,
				name: 'count'
			}, {
				xtype: 'textfield',
				label: 'Сумма',
				name: 'sum'
			}, {
				xtype: 'textfield',
				label: 'Остаток',
				name: 'account'
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
				text: 'Купить'
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