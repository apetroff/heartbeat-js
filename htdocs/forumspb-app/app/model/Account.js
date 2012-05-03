Ext.define('Spief.model.Account', {
	extend: 'Ext.data.Model',
	
	config: {
		
		fields: [
			{name: '_id', type: 'string', defaulValue: ''},
			{name: 'cache', type: 'number', defaulValue: 100000},
			{name: 'actives', type: 'number', defaulValue: 100000},
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
	
	set: function() {
		this.callParent(arguments);
		this.fireEvent('sync');
	},
	
	reset: function() {
		this.set({_id: null, cache: 0, actives: 0, packageCount: 0, briefcase: null});
	},
	
	getBuyAbility: function(id) {
		
		var store = Ext.getStore('Companies'),
			company = store.getById(id),
			daily = company.get('daily'),
			cache = this.get('cache');
		
		return cache >= daily.last;
	},
	
	getSellAbility: function(id) {
		
		var briefcase = this.get('briefcase'),
			count = briefcase && briefcase[id] || 0;
		
		return count > 0;
	},
	
	recalculate: function() {
		console.log ('recalculateBriefcase');
		
		var briefcase = this.get('briefcase'),
			actives = 0,
			store = Ext.getStore('Companies'),
			company, daily,
			count = 0;
		
		for (var id in briefcase) {
			company = store.getById(id);
			daily = company.get('daily');
			actives += briefcase[id] * daily.last;
			count++;
		}
		
		actives += this.get('cache');
		actives = Math.round(actives);
		
		this.set({actives: actives, packageCount: count});
	}
});