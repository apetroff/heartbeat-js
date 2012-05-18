Ext.define('Spief.util.Prime', {
	
	singleton: true,
	
	process: function(url, callback) {

		var me = this,
			companyModel;
		
		me.companiesStore = Ext.getStore('Companies');
		me.tickersStore = Ext.getStore('Tickers');
		
		me.tickersStore.on('load', me.onTickersLoaded, me);
		
		Ext.data.JsonP.request({
		    url: url,
		    callbackName: 'companiesCb',

		    success: function(data) {

		        Ext.Array.each(data.companies, function(company) {

		            companyModel = Ext.create('Spief.model.Company', company);
					me.companiesStore.add(companyModel);
					
		        });
				
				me.tickersStore.load();
				
				callback();
		    }
		});
	},
	
	onTickersLoaded: function(store, records) {
		
		var me = this;
		
		records.map(function(daily) {
			var id = daily.getId(),
				companyModel = me.companiesStore.getById(id);
			
			companyModel.set('daily', daily.data);
		});
		
		if (Spief.accountModel) Spief.accountModel.recalculate();
		
		me.briefcaseCompaniesUpdate();
		
	},
	
	briefcaseCompaniesUpdate: function() {
		
		var briefcase = Spief.accountModel.get('briefcase');
		
		console.log('<<<---', briefcase);
		
		if (!briefcase) return;
		
		this.companiesStore.each(function(companyModel) {
			
			var id = companyModel.getId(),
				count = briefcase[id] || 0;
			
			console.log('<<<---', id, briefcase[id]);
			companyModel.set('briefcaseCount', count);
			
		}, this);
	}
	
});