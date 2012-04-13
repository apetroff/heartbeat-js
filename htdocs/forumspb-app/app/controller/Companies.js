Ext.define('Spief.controller.Companies', {
	extend: 'Ext.app.Controller',

	config: {
		
		refs: {
			companies: 'companies'
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

			this.loadedCompanies = true;
		}
	},

	onCompanyTap: function(list, idx, el, record) {
		console.log (record.getId());
	}	

});
