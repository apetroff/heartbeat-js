Ext.define('Spief.view.companies.Comments', {
	extend: 'Ext.List',
    xtype: 'commentslist',

    config: {
		heigth: 300,
		width: 300,
		itemCls: 'comment',
        itemTpl: new Ext.XTemplate(
			'<h2>{title}</h2>'
		)
    }
});
