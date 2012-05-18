Ext.define('Spief.model.Company', {
	extend: 'Ext.data.Model',

	config: {
	
		idProperty: '_id',
		
		fields: [
			{name: '_id', type: 'number'},
			'title',
			'tickers',
			'daily',
			'briefcaseCount',
			'region',
			'sector',
			'description',
			'info'
		]
	}
});