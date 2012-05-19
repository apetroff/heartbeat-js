Ext.define('Ria.model.Comment', {
	extend: 'Ext.data.Model',

	config: {
	
		idProperty: '_id',
	
		fields: [
			{name: '_id', type: 'string'},
			{name: 'companyId', type: 'number'},
			{name: 'title', type: 'string'},
			{name: 'lead', type: 'string'},
			{name: 'date', type: 'date', dateFormat: 'timestamp'}
		]
	}
});