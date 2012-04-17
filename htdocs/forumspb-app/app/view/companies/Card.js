Ext.define('Spief.view.companies.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'companiesContainer',
	
	config: {

        tab: {
			title: 'Компании',
			iconCls: 'briefcase1',
			cls: 'companies',
	        action: 'companiesTab'
	    },

        autoDestroy: false,

		items: [
			{
				xtype: 'companies',
				store: 'Companies',
				grouped: true,
				pinHeaders: false,
				indexBar: {
					letters: 'А Б В Г Д Е Ж З И К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ы Э Ю Я'.split(' ')
				}
			}
		]
	}
});
