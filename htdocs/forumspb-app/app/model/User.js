Ext.define('Spief.model.User', {
	extend: 'Ext.data.Model',
	
	config: {
		
		idProperty: '_id',
		
		fields: [
			'_id',
			'username',
			'password',
			'role',
			'briefcase'
		],
		
		validations: [{
			field: 'username',
			type: 'presence',
			message: 'Укажите имя'
		}, {
			field: 'password',
			type: 'format',
			matcher: /^\d{4,6}$/,
			message: 'Укажите код из 4-6 цифр'
		}]
	}
});