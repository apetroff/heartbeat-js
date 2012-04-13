Ext.define('Spief.store.Companies', {
    extend: 'Ext.data.Store',
	
	require: ['Spief.data.proxy.Prime'],

    config: {
        fields: ['id', 'title', 'region', 'sector'],

        proxy: {
			type: 'ajax',
            url: 'data/companies.json',
			
			reader: {
				type: 'json',
				rootProperty: 'companies'
			}
        }
    }
});
