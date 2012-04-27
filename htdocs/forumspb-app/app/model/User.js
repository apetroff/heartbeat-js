Ext.define('Spief.model.User', {
	extend: 'Ext.data.Model',
	
	config: {
		
		fields: [
			{name: '_id', type: 'string'},
			{name: 'username', type: 'string'},
			{name: 'password', type: 'string'},
			{name: 'role', type: 'string'}
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
	},
	
	setData: function() {
		this.callParent(arguments);
		this.fireEvent('sync');
	},
	
	reset: function() {
		this.setData({role: 'anonymous'});
	},
});