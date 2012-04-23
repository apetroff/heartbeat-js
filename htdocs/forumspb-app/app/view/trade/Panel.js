Ext.define('Spief.view.trade.Panel', {

	extend: 'Ext.Container',
	xtype: 'tradePanel',

	config: {
		
		layout: {
			type: 'hbox',
			align: 'center'
		},
		
		margin: '5 15',
		
		defaults: {
			xtype: 'button',
		},
		
		items: [{
			text: 'Купить',
			ui: 'confirm'
		}, {
			xtype: 'spacer',
			width: 5
		},{
			text: 'Продать',
			ui: 'decline'
		}]
		
	}
});