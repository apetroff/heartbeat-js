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
				'<h3>{title}',
					'<tpl if="daily.changeProc">',
						' | {daily.code}',
					'</tpl>',
				'</h3>',
					'<tpl if="daily.changeProc">',
					'<h3 class="{[this.getTrendClass(values.daily.changeProc)]}">',
						'<span class="price">{daily.last}</span> <span class="percent">{daily.changeProc}%</span>',
					'</h3>',
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
