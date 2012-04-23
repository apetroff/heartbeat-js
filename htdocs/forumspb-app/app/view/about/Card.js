Ext.define('Spief.view.about.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'aboutContainer',

	config: {

		title: 'Инфо',
        iconCls: 'info',

        autoDestroy: false,
		
		items: [
			{
				xtype: 'aboutList'
			}
		]
	}
});
