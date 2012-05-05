Ext.define('Spief.view.trade.SellForm', {
	
	extend: 'Ext.form.Panel',
	xtype: 'sellForm',

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
			title: 'Продажа',
			instructions: 'Переводите купленные акции в кэш',
			defaults: {
				labelWidth: 200
			},
			items: [{
				label: 'Количество акций',
				xtype: 'spinnerfield',
				groupButtons: false,
				minValue: 100,
				maxValue: 10000,
				increnment: 100,
				defaultValue: 300,
				name: 'packageCount'
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
				text: 'Продать'
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