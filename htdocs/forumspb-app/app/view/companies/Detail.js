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
				tabBar: {
					layout: {
						type: 'hbox',
						pack: 'center'
				   }
				},
				flex: 1,
				defaults: {
					flex: 1
				},
				items:[{
					xtype: 'newslist'
				}, {
					xtype: 'commentslist'
				}, {
					xtype: 'infoCard'
				}]
			}
		]

	}
});
