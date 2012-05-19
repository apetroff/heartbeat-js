Ext.define('Ria.store.Comments', {
    extend: 'Ext.data.Store',

    config: {
	
		autoDestroy: true,
		remoteFilter: true,
		remoteSort: true,
		
		model: 'Ria.model.Comment',
		
		pageSize: 10,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/comments/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		},
		
		sorters: [{property: 'date', direction: 'DESC'}]
    }
});
