Ext.define('Spief.store.Comments', {
    extend: 'Ext.data.Store',

    config: {
	
		model: 'Spief.model.Comment',
		
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
