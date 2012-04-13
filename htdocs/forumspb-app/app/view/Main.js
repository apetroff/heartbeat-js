Ext.define('Spief.view.Main', {

	extend: 'Ext.tab.Panel',
	xtype: 'main',

	config: {

		tabBarPosition: 'bottom',
		tabBar: {
			ui: 'gray'
		},

		items: [
			{ xclass: 'Spief.view.session.Card' },
			{ xclass: 'Spief.view.speaker.Card' },
			{ xclass: 'Spief.view.companies.Card' },
			{ xclass: 'Spief.view.about.Card' }
		]
	}
});
