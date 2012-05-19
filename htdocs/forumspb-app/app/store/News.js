Ext.define('Spief.store.News', {
    extend: 'Ext.data.Store',

    config: {
	
		autoLoad: true,
		remoteFilter: true,
		remoteSort: true,
		
		model: 'Spief.model.News',
		
		pageSize: 100,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/news/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		},
		
		sorter: ['date']
    }
});
