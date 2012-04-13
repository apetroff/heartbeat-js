Ext.define('Spief.store.Sessions', {
	extend: 'Ext.data.Store',

	requires: 'Ext.DateExtras',

    config: {

        model: 'Spief.model.Session',

        grouper: {
            sortProperty: 'time',
            groupFn: function(record) {
            	return Ext.Date.format(record.get('startDate'), 'G:i');
            }
        },

        sorters: [
        	{
            	property: 'startDate',
            	direction: 'ASC'
            }
        ]
    }
})
