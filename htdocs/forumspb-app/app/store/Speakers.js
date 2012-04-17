Ext.define('Spief.store.Speakers', {
	extend: 'Ext.data.Store',

    config: {
        model: 'Spief.model.Speaker',

        grouper: {
            groupFn: function(record) {
                return record.get('surname').substr(0, 1).toUpperCase();
            },
        },
		
		sorters: [
			{
				sorterFn: function(record1, record2) {
					var name1 = record1.data.surname.toUpperCase(),
						name2 = record2.data.surname.toUpperCase();

					return name1 > name2 ? 1 : (name1 == name2 ? 0 : -1);
				},
				direction: 'ASC'
			}
		]
    }
});
