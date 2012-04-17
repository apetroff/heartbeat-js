Ext.define('Spief.model.ExtendedCompany', {
	extend: 'Spief.model.Company',

	config: {
		fields: [
			'description',
			'info',
			'daily',
			'yearly',
			'news',
			'comments',
			'docs'
		]
	}
});