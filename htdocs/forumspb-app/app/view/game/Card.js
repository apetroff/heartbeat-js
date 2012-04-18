Ext.define('Spief.view.game.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'gameContainer',

	config: {

        tab: {
			title: 'Игра',
	        iconCls: 'play_black1',
	        action: 'gamesTab'
	    },

        autoDestroy: false,

		items: [
			{
				xtype: 'games',
				grouped: true,
				pinHeaders: false,
				indexBar: {
					letters: 'А Б В Г Д Е Ж З И К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ы Э Ю Я'.split(' ')
				}
			}
		]
	}
});
