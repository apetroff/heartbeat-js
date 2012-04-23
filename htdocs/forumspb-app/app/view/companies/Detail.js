Ext.define('Spief.view.companies.Detail', {

	extend: 'Ext.Container',
	xtype: 'company',

	config: {

		layout: 'vbox',
		scrollable: 'vertical',
		
		items: [
			{
				xtype: 'companyInfo'
			},
			{
				xtype: 'infoCard'
			}
		]

	}
});
