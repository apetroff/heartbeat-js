Ext.define('Spief.view.companies.List', {
	extend: 'Ext.List',
    xtype: 'companies',

    config: {
		title: 'Компании',

        emptyText: '<p class="no-searches">No companies</p>',
		
		itemCls: 'companies',
        itemTpl: [
			'<h2>{title}</h2>',
			'<p>{region} | {sector}</p>'
		]
    }
});
