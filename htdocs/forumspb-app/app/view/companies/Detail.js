Ext.define('Spief.view.companies.Detail', {

	extend: 'Ext.Container',
	xtype: 'company',

	config: {

		layout: 'vbox',
		//scrollable: 'vertical',
		
		items: [
			{
				xtype: 'companyInfo'
			}, {
				xtype: 'tabpanel',
				flex: 1,
				defaults: {
					flex: 1
				},
				items:[{
					xtype: 'infoCard'
				}, {
					xtype: 'newslist'
				}, {
					xtype: 'commentslist'
				}]
			}
		]

	}
});
