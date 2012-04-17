Ext.define('Spief.controller.Companies', {
	extend: 'Ext.app.Controller',
	
	requires: ['Spief.util.Prime'],

	config: {
		
		refs: {
			companies: 'companies',
			companiesContainer: 'companiesContainer',
			company: 'company',
			companyInfo: 'companiesContainer companyInfo'
		},
		
		control: {
			companies: {
				activate: 'onActivate',
				itemtap: 'onCompanyTap'
			}
		}
	},
	
	onActivate: function() {
		
		if (!this.loadedCompanies) {

			Ext.getStore('Companies').load();
			
			this.extendedStore = Ext.getStore('ExtendedCompanies');
			this.primeProxy = Spief.util.Prime;
			
			console.log (this.primeProxy, Spief.util.Prime);

			this.loadedCompanies = true;
		}
	},

	onCompanyTap: function(list, idx, el, record) {
		
		if (!this.company) {
			this.company = Ext.widget('company');
		}
		
		var id = record.getId();
		
		this.currentRecord = record;
		this.extendedCompany = this.extendedStore.getById(id);
		
		if (this.extendedCompany) {
		
			this.allInfoShow = false;
			this.primeProxy.process(id, false, this.onExtendedDataLoaded, this);
		
		} else {
			
			this.allInfoShow = true;
			Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка...' });
			this.primeProxy.process(id, true, this.onExtendedDataLoaded, this);
		}
	},
	
	onExtendedDataLoaded: function() {
		
		if (this.allInfoShow) {
			Ext.Viewport.setMasked(false);
			this.maskShow = false;
			
			this.company.config.title = this.currentRecord.get('title');
			this.getCompaniesContainer().push(this.company);
			this.getCompanyInfo().setRecord(this.currentRecord);
			
		}
	}

});
