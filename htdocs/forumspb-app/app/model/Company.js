Ext.define('Spief.model.Company', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			'id',
			'title',
			'tickers',
			'daily',
			'region',
			'sector'
		]
	}
});