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
			
			tradeForm: 'tradeForm',
			buyButton: 'companyInfo button[ui=confirm]',
			sellButton: 'companyInfo button[ui=decline]'
		},
		
		control: {
			companies: {
				activate: 'onActivate',
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
	
	onActivate: function() {
		
		if (!this.loadedCompanies) {

			this.companiesStore = Ext.getStore('Companies');
			this.primeProxy = Spief.util.Prime;
			
			this.primeProxy.process('data/companies.js', Ext.bind(this.onFirstLoad));
			
			this.loadedCompanies = true;
		}
	},
	
	onBuy: function( b, e, eOpts ) {

		if (this.getTradeForm().getHidden()) {
			this.getTradeForm().show();
		} else {
			this.getTradeForm().hide();
		}
	},
	
	onSell: function( b, e, eOpts ) {

		if (this.getTradeForm().getHidden()) {
			this.getTradeForm().show();
		} else {
			this.getTradeForm().hide();
		}
	},
	
	onFirstLoad: function() {
		console.log('loaded');
	},

	onCompanyTap: function(list, idx, el, record) {
		
		if (!this.company) {
			this.company = Ext.widget('company');
		}
		
		var id = record.getId();
		
		this.currentRecord = record;
		this.primeProxy.processCompany(id, true, this.onExtendedDataLoaded, this);
	},
	
	onExtendedDataLoaded: function() {
		
		this.company.config.title = this.currentRecord.get('title');
		this.getCompaniesContainer().push(this.company);
		this.getCompanyInfo().setRecord(this.currentRecord);
		this.getInfoCard().setRecord(this.currentRecord);
	}

});
