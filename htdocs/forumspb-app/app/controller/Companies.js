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
		this.primeProxy = Spief.util.Prime;
		
		this.primeProxy.process('data/companies.js', Ext.bind(this.onFirstLoad));
		
		Spief.userModel.on('sync', this.onUserSync, this);
		Spief.accountModel.on('sync', this.onAccountSync, this);
	},
	
	onUserSync: function() {
		
		var tradePanel = this.getTradePanel();
		
		if (!tradePanel) return;
		
		if (Spief.userModel.get('role') == 'user') {
			tradePanel.show();
		} else {
			tradePanel.hide();
		}
	},
	
	onAccountSync: function() {
		
		var buyButton = this.getBuyButton(),
			sellButton = this.getSellButton();
		if (!buyButton || !sellButton) return;
		
		var positive = Spief.accountModel.get('sume') > 0;
		buyButton.setDisabled(positive);
		
		var briefCase = Spief.accountModel.get('briefcase');
		sellButton.setDisabled(!briefCase);
		
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
		
		this.onUserSync();
		this.onAccountSync();
		
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
