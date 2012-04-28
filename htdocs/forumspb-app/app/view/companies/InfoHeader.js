Ext.define('Spief.view.companies.InfoHeader', {

	extend: 'Ext.Container',
	xtype: 'companyInfo',

	config: {

		cls: 'companyInfo',
		
		items: [{
			xtype: 'tradePanel',
			docked: 'right'
		}],
		
		tpl: new Ext.XTemplate(
			'<div class="header">',
				'<h3>{title}</h3>',
					'<tpl if="daily.changeProc">',
					'<div class="ticker {[this.getTrendClass(values.daily.changeProc)]}">',
						'<span class="title">{daily.code}</span><span class="price">{daily.last}</span><span class="percent">{daily.changeProc}%</span>',
					'</div>',
				'</tpl>',
			'</div>',
			{
				getTrendClass: function(value) {
					value = parseFloat(value);
					if (value < 0) return 'negative';
					return 'positive';
				}
			}
		)
	}
});
