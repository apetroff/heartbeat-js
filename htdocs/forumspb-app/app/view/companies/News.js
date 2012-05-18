Ext.define('Spief.view.companies.News', {
	extend: 'Ext.List',
    xtype: 'newslist',

    config: {
		title: 'Новости',
		itemCls: 'news',
        ui: 'round',
		itemTpl: [ '{date}','{title}' ],
		store: 'News'
    }
});