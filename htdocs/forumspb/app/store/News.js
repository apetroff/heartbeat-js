Ext.define('Ria.store.News', {
    extend: 'Ext.data.Store',

    config: {
	
		autoLoad: true,
		model: 'Ria.model.News',
		
		pageSize: 100,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/news/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		}
    }
});
