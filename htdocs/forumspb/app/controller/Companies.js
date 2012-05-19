Ext.define('Ria.controller.Companies', {
	extend: 'Ext.app.Controller',
	
	requires: ['Ria.util.Prime'],

	config: {
		
		refs: {
			company: 'tilesitem'
		},

		control: {
			company: {
				openInfoWindow: 'getNews'
			}
		}
	},

	getNews: function (companyView) {
		var rec = companyView.getRecord();
		var id = rec.get('_id');
		this.companyFilter.setValue(id.toString());
		this.newsStore.load({
			scope: companyView,
			callback: companyView.onNewsLoad
		});
		this.commentsStore.load({
			scope: companyView,
			callback: companyView.onCommentsLoad
		});
	},
	
	launch: function() {
		this.companiesStore = Ext.getStore('Companies');
		this.primeProxy = Ria.util.Prime;

		this.newsStore = Ext.getStore('News');
		this.commentsStore = Ext.getStore('Comments');

		this.primeProxy.process('data/companies.js', Ext.bind(this.onFirstLoad));

		this.companyFilter = new Ext.util.Filter({
			property: 'companyId',
			value   : '0'
		});

		this.newsStore.setFilters([this.companyFilter]);
		this.commentsStore.setFilters([this.companyFilter]);
	},

	onFirstLoad: function() {
		
	}
});
