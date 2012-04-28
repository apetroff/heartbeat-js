Ext.define('Spief.view.Main', {

	extend: 'Ext.tab.Panel',
	xtype: 'main',

	config: {

		tabBarPosition: 'bottom',
		tabBar: {
			ui: 'gray'
		},

		items: [
			{ xclass: 'Spief.view.user.Panel'},
			{ xclass: 'Spief.view.session.Card' },
			{ xclass: 'Spief.view.speaker.Card' },
			{ xclass: 'Spief.view.companies.Card' },
			{ xclass: 'Spief.view.about.Card' },
			
			{ xclass: 'Spief.view.user.Login' },
			{ xclass: 'Spief.view.user.Account' },
			{ xclass: 'Spief.view.trade.BuyForm' },
			{ xclass: 'Spief.view.trade.SellForm' }
		]
	}
});
