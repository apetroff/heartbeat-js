Ext.define('Spief.model.Session', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			'id',
			'title',
			'topic',
			{
				name: 'startDate',
				type: 'date',
			},
			{
				name: 'startDate',
				type: 'date',
			},
			'speakerIds'
		]
	}
});