Ext.define('Spief.store.News', {
    extend: 'Ext.data.Store',

    config: {
	
		autoDestroy: true,
		remoteFilter: true,
		remoteSort: true,
		
		model: 'Spief.model.News',
		
		pageSize: 10,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/news/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		},
		
		sorters: [{property: 'date', direction: 'DESC'}]
    },
	
	
});
