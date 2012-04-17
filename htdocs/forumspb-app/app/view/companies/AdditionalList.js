Ext.define('Spief.view.companies.AdditionalList', {

	extend: 'Ext.List',
	xtype: 'additionalList',

	config: {
		
		ui: 'round',
		scrollable: false,
				
		itemTpl: '{title}'
	},

	initialize: function() {
		this.callParent();
		this.setData(Spief.app.companyAdditionalPages);
	}
});
