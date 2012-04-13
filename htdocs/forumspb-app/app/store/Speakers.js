Ext.define('Spief.store.Speakers', {
	extend: 'Ext.data.Store',

    config: {
        model: 'Spief.model.Speaker',

        grouper: {
        	groupFn: function(record) {
        		return record.get('surname').substr(0,1);
        	},
        	sortProperty: 'surname'
        }
    }
});
