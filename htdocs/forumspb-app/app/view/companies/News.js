Ext.define('Spief.view.companies.News', {
	extend: 'Ext.List',
    xtype: 'newslist',

    config: {
		heigth: 300,
		width: 300,
		itemCls: 'news',
        itemTpl: new Ext.XTemplate(
			'<h2>{title}</h2>'
		)
    }
});