Ext.define('Spief.view.game.Detail', {

	extend: 'Ext.Container',
	xtype: 'gamer',

	config: {

		layout: 'vbox',
		scrollable: 'vertical',

		items: [
			{
				xtype: 'gamerInfo'
			},
			{
				xtype: 'list',
				store: 'Gamer',

				scrollable: false,

				items: [
					{
						xtype: 'listitemheader',
						cls: 'dark',
						html: 'Сессии'
					}
				],

				itemTpl: [
					'{title}'
				]
			}
		]

	}
});
