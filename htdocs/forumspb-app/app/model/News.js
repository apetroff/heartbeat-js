Ext.define('Spief.model.News', {
	extend: 'Ext.data.Model',

	config: {
	
		idProperty: '_id',
	
		fields: [
			{name: '_id', type: 'number'},
			{name: 'actionName', type: 'string'},
			{name: 'ask', type: 'number'},
			{name: 'bid', type: 'number'},
			{name: 'changeProc', type: 'number'},
			{name: 'code', type: 'string'},
			{name: 'date', dateFormat: 'timestamp', type: 'date'},
			{name: 'exchangeName', type: 'string'},
			{name: 'high', type: 'number'},
			{name: 'last', type: 'number'},
			{name: 'low', type: 'number'},
			{name: 'trade', type: 'number'},
			{name: 'updated', type: 'number'},
			{name: 'vDay', type: 'number'},
			{name: 'vDol', type: 'number'},
			{name: 'vRub', type: 'number'},
			{name: 'wa', type: 'number'}
		]
	}
});