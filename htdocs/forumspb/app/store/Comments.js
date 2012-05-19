Ext.define('Ria.store.Comments', {
    extend: 'Ext.data.Store',

    config: {
	
		autoLoad: true,
		model: 'Ria.model.Comment',
		
		pageSize: 100,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/comments/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		}
    }
});
