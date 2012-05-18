Ext.define('Ria.store.Tickers', {
    extend: 'Ext.data.Store',

	storeId: 'tickersStore',

    config: {
	
		model: 'Ria.model.Ticker',
		
		pageSize: 100,
		
		proxy: {
			type: 'ajax',			
			
			url: '/entity/tickers/list.json',
			idField: '_id',
			
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		}
    }
});
