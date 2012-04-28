Ext.define('Spief.controller.Trade', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			tradeForm: 'tradeForm',
			tradePanel: 'companyInfo tradePanel',
			buyButton: 'tradePanel button[ui=confirm]',
			sellButton: 'tradePanel button[ui=decline]'
		},
		
		control: {
			
		}
	},
	
	launch: function() {
		console.log('Trade launch');
	}
});
