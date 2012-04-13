Ext.define('Spief.view.companies.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'companiesContainer',

	config: {

        tab: {
			title: 'Компании',
			iconCls: 'briefcase1',
			cls: 'companies',
	        action: 'companiesTab'
	    },

        autoDestroy: false,

		items: [
			{
				xtype: 'companies',
				store: 'Companies'
			}
		]
	}
});
