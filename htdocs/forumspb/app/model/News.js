Ext.define('Ria.model.News', {
	extend: 'Ext.data.Model',

	config: {
	
		idProperty: '_id',
	
		fields: [
			{name: '_id', type: 'string'},
			{name: 'companyId', type: 'string'},
			{name: 'title', type: 'string'},
			{name: 'date', type: 'date', dateFormat: 'timestamp'}
		]
	}
});