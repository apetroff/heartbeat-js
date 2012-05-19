Ext.define('Spief.view.companies.InfoCard', {

	extend: 'Ext.form.Panel',
	xtype: 'infoCard',
	
	config: {
		
		title: 'Карточка компании',
		cls: 'infoCard',

		scrollable: true,
		defaults: {
			defaults: {
				readOnly: true,
				labelWidth: 230,
				clearIcon: false
			}
		},
		
		items: [{
			xtype: 'fieldset',
			
			title: 'Информационная карточка',
			items: [{
				xtype: 'textfield',
				label: 'Полное наименование',
				name: 'fullTitle'
			}, {
				xtype: 'textfield',
				label: 'Юридический адрес',
				name: 'address',
			}, {
				xtype: 'urlfield',
				label: 'Сайт в Интернете',
				name: 'site'
			}, {
				xtype: 'textfield',
				label: 'Руководитель',
				name: 'ceo'
			}, {
				xtype: 'numberfield',
				label: 'Уставный капитал, тыс. руб.',
				name: 'authCapital'
			}, {
				xtype: 'textfield',
				label: 'Регион',
				name: 'region'
			}, {
				xtype: 'textfield',
				label: 'Сфера деятельности',
				name: 'field'
			}, {
				xtype: 'textfield',
				label: 'Отрасль',
				name: 'sector'
			}]
		}, {
			xtype: 'container',
			cls: 'x-form-fieldset-title',
			itemId: 'descriptionHeader',
			html: 'Описание'
		}, {
			xtype: 'container',
			cls: 'x-description-field',
			itemId: 'description',
			tpl: '{description}'
		}]
	},
	
	setRecord: function(record) {
		
		var header = this.getComponent('descriptionHeader');
		var description = this.getComponent('description');
		
		if (record.get('description')) {
			header.show();
			description.show();
			description.setRecord(record);
		} else {
			header.hide();
			description.hide();
		}

		this.setValues(record.get('info'));
		
	}
});
