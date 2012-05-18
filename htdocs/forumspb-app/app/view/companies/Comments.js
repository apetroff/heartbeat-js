Ext.define('Spief.view.companies.Comments', {
	extend: 'Ext.List',
    xtype: 'commentslist',

    config: {
		title: 'Комментарии',
		itemCls: 'comment',
        ui: 'round',
		itemTpl: [ '{date}','{title}','{lead}' ],
		store: 'Comments'
    }
});
