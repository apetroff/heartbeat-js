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
				indexBar: true
			}
		]
	}
});
