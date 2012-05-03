Ext.define('Spief.view.trade.BuyForm', {
	
	extend: 'Ext.form.Panel',
	xtype: 'buyForm',

	config: {
		
		cls: 'trade',
		
		scrollable: false,
		
		hidden: true,
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
			instructions: 'Обменивайте свой кэш на акции компаний',
			defaults: {
				labelWidth: 200
			},
			items: [{
				label: 'Количество акций',
				xtype: 'spinnerfield',
				groupButtons: false,
				minValue: 1,
				maxValue: 10000,
				increnment: 1,
				name: 'count'
			}, {
				xtype: 'numberfield',
				label: 'Сумма',
				inputCls: 'rur',
				readOnly: true,
				name: 'cache'
			}, {
				xtype: 'numberfield',
				label: 'Кэш',
				inputCls: 'rur',
				readOnly: true,
				name: 'remain'
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