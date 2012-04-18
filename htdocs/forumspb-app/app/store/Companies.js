Ext.define('Spief.store.Companies', {
    extend: 'Ext.data.Store',

    config: {
        
		model: 'Spief.model.Company',
		
		grouper: {
            groupFn: function(record) {
                return record.get('title').substr(0, 1).toUpperCase();
            },
        },
		
		sorters: [
			{
				sorterFn: function(record1, record2) {
					var name1 = record1.data.title.toUpperCase(),
						name2 = record2.data.title.toUpperCase();

					return name1 > name2 ? 1 : (name1 == name2 ? 0 : -1);
				},
				direction: 'ASC'
			}
		]
    }
});
