Ext.define('Spief.view.speaker.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'speakerContainer',

	config: {

        tab: {
			title: 'Участники',
	        iconCls: 'team1',
	        action: 'speakersTab'
	    },

        autoDestroy: false,

		items: [
			{
				xtype: 'speakers',
				store: 'Speakers',
				grouped: true,
				pinHeaders: false,
				indexBar: {
					letters: 'А Б В Г Д Е Ж З И К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ы Э Ю Я'.split(' ')
				}
			}
		]
	}
});
