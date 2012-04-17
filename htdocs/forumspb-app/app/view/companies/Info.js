Ext.define('Spief.view.companies.Info', {

	extend: 'Ext.Container',
	xtype: 'companyInfo',

	config: {

		cls: 'speakerInfo',
		tpl: [
			'<div class="header">',
				'<h3>{title}</h3>',
				'<h4>Текущий индекс {daily}</h4>',
				'<h4>Индекс за год {yearly}</h4>',
			'</div>'
		]
	}
});
