Ext.define('Spief.model.Account', {
	extend: 'Ext.data.Model',
	
	config: {
		
		fields: [
			'_id',
			{name: 'cache', type: 'number'},
			{name: 'actives', type: 'number'},
			{name: 'packageCount', type: 'number'},
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
		
		var store = Ext.getStore('Tickers'),
			ticker = store.getById(id),
			cache = this.get('cache');
		
		return cache >= ticker.get('last');
	},
	
	getSellAbility: function(id) {
		
		var briefcase = this.get('briefcase'),
			count = briefcase && briefcase[id] || 0;
		
		return count > 0;
	},
	
	recalculate: function() {
		
		var briefcase = this.get('briefcase'),
			actives = 0,
			store = Ext.getStore('Tickers'),
			daily,
			count = 0;
		
		for (var id in briefcase) {
			daily = store.getById(id);
			actives += briefcase[id] * daily.get('last');
			count++;
		}
		
		actives += this.get('cache');
		actives = Math.round(actives);
		
		this.set({actives: actives, packageCount: count});
	}
});