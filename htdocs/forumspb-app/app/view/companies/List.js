Ext.define('Spief.view.companies.List', {
	extend: 'Ext.List',
    xtype: 'companies',

    config: {
		title: 'Прайм Play',

        emptyText: '<p class="no-searches">No companies</p>',
		
		itemCls: 'companies',
        itemTpl: new Ext.XTemplate(
			'<h2>{title}</h2>',
			'<p>{region} | {sector}</p>',
			'<tpl if="daily.changeProc">',
				'<div class="ticker {[this.getTrendClass(values.daily.changeProc)]}">',
					'<span class="title">{daily.code}</span><span class="price">{daily.last}</span><span class="percent">{daily.changeProc}%</span>',
				'</div>',
			'</tpl>',
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
