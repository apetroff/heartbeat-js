Ext.define('Spief.view.about.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'aboutContainer',

	config: {

		title: 'Информация',
        iconCls: 'info',

        autoDestroy: false,
		
		items: [
			{
				xtype: 'aboutList'
			}
		]
	}
});
