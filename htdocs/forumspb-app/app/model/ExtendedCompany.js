Ext.define('Spief.model.ExtendedCompany', {
	extend: 'Spief.model.Company',

	config: {
		fields: [
			'description',
			'info',
			'yearly',
			'news',
			'comments',
			'docs'
		]
	}
});