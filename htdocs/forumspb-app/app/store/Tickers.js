Ext.define('Spief.store.Tickers', {
    extend: 'Ext.data.Store',

    config: {
	
		model: 'Spief.model.Ticker',
		
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
