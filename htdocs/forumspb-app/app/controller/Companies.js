Ext.define('Spief.controller.Companies', {
	extend: 'Ext.app.Controller',
	
	requires: ['Spief.util.Prime'],

	config: {
		
		refs: {
			companies: 'companies',
			companiesContainer: 'companiesContainer',
			company: 'company',
			companyInfo: 'companiesContainer companyInfo',
			
			infoCard: 'infoCard',
			
			buyForm: 'buyForm',
			sellForm: 'sellForm',
			
			tradePanel: 'companyInfo tradePanel',
			buyButton: 'tradePanel button[ui=confirm]',
			sellButton: 'tradePanel button[ui=decline]'
		},
		
		control: {
			companies: {
				itemtap: 'onCompanyTap'
			},
			
			buyButton: {
				tap: 'onBuy'
			},
			
			sellButton: {
				tap: 'onSell'
			}
		}
	},
	
	launch: function() {
		
		this.companiesStore = Ext.getStore('Companies');
		
		// - - -
		
		this.newsStore = Ext.getStore('News');
		this.commentsStore = Ext.getStore('Comments');
		
		this.companyFilter = new Ext.util.Filter({
			property: 'companyId',
			value   : '0'
		});
		
		this.newsStore.setFilters([this.companyFilter]);
		this.commentsStore.setFilters([this.companyFilter]);
		
		// - - -
		
		this.primeProxy = Spief.util.Prime;
		
		this.primeProxy.process('data/companies.js', Ext.bind(this.onFirstLoad));
		
		Spief.userModel.on('sync', this.onSync, this);
		Spief.accountModel.on('sync', this.onSync, this);
	},
	
	onSync: function() {
		
		var tradePanel = this.getTradePanel();
		
		if (!tradePanel) return;
		
		if (Spief.userModel.get('role') == 'user') {
			
			this.checkDaily();
			
		} else {
			tradePanel.hide();
		}
	},
	
	onBuy: function( b, e, eOpts ) {
		this.getBuyForm().show();
	},
	
	onSell: function( b, e, eOpts ) {
		this.getSellForm().show();
	},
	
	onFirstLoad: function() {
		
	},

	onCompanyTap: function(list, idx, el, record) {
		
		if (!this.company) {
			this.company = Ext.widget('company');
		}
		
		var id = record.getId();
		
		Spief.companyModel = this.currentCompany = record;
		
		this.onSync();
		
		this.setCompanyInfo();
		
		//this.checkDaily();
	},
	
	checkDaily: function() {
		
		var tradePanel = this.getTradePanel();
		
		var daily = (this.currentCompany) ? this.currentCompany.get('daily') : null;
		
		if (this.currentCompany && daily && daily.last) {
		
			tradePanel.show();
			
			var buyButton = this.getBuyButton(),
				sellButton = this.getSellButton();
		
			if (!buyButton || !sellButton) return;
			
			var id = this.currentCompany.getId();
			
			buyButton.setDisabled(!Spief.accountModel.getBuyAbility(id));
			sellButton.setDisabled(!Spief.accountModel.getSellAbility(id));
			
			
		} else {
			tradePanel.hide();
		}		
	},
	
	setCompanyInfo: function() {
		
		this.company.config.title = this.currentCompany.get('title');
		this.getCompaniesContainer().push(this.company);
		this.getCompanyInfo().setRecord(this.currentCompany);
		this.getInfoCard().setRecord(this.currentCompany);
		
		this.companyFilter.setValue(this.currentCompany.getId().toString())
		
		console.log('<<<<<<<<<<<<<<', this.companyFilter);		
		
		this.newsStore.load();
		this.commentsStore.load();
	}

});
