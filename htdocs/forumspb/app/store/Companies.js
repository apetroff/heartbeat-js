Ext.define('Ria.store.Companies', {
    extend: 'Ext.data.Store',

    config: {
		model: 'Ria.model.Company',
        autoLoad: true,
        remoteFilter: true
	}
});
