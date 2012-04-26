Ext.define('Spief.model.Account', {
	extend: 'Ext.data.Model',
	
	config: {
		
		fields: [
			{name: '_id', type: 'string'},
			{name: 'sum', type: 'number', defaulValue: 100000},
			{name: 'packageCount', type: 'number', defaulValue: 0},
			'briefcase'
		],
		
		proxy: {
            type: 'ajax',
            api : {
				create: '/entity/accounts/create.json',
				read: '/entity/accounts/list.json',
				update: '/entity/accounts/update.json'
			}
        }
	},
	
	recalculateBriefcase: function() {
		console.log ();
	}
});