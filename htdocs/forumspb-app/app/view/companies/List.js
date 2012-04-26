Ext.define('Spief.view.companies.List', {
	extend: 'Ext.List',
    xtype: 'companies',

    config: {
		title: 'Прайм Play',

        emptyText: '<p class="no-searches">No companies</p>',
		
		itemCls: 'companies',
        itemTpl: new Ext.XTemplate(
			'<h2>{title}',
				'<tpl if="daily.changeProc">',
					' | {daily.code}',
				'</tpl>',
			'</h2>',
			'<p>{region} | {sector}</p>',
			'<tpl if="daily.changeProc">',
				'<h3 class="{[this.getTrendClass(values.daily.changeProc)]}">',
					'<span class="price">{daily.last}</span> <span class="percent">{daily.changeProc}%</span>',
				'</h3>',
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
