Ext.define('Ria.controller.Companies', {
	extend: 'Ext.app.Controller',
	
	requires: ['Ria.util.Prime'],

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
		this.primeProxy = Ria.util.Prime;
		
		this.primeProxy.process('data/companies.js', Ext.bind(this.onFirstLoad));
	},

	onFirstLoad: function() {
		
	},

	onCompanyTap: function(list, idx, el, record) {
		if (!this.company) {
			this.company = Ext.widget('company');
		}
		
		var id = record.getId();
		
		Ria.companyModel = this.currentCompany = record;
		
		this.onSync();
		
		this.setCompanyInfo();
	},
	
	setCompanyInfo: function() {
		this.company.config.title = this.currentCompany.get('title');
		this.getCompaniesContainer().push(this.company);
		this.getCompanyInfo().setRecord(this.currentCompany);
		this.getInfoCard().setRecord(this.currentCompany);
	}

});
