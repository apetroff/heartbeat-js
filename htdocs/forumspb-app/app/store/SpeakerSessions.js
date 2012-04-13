Ext.define('Spief.store.SpeakerSessions', {
	extend: 'Ext.data.Store',

    config: {
        model: 'Spief.model.Session',

        sorters: [
        	{
            	property: 'startDate',
            	direction: 'ASC'
            }
        ]
    }
})
