Ext.define('Spief.model.Speaker', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			'id',
			'name',
			'surname',
			'post',
			'sessionIds',
			'avatar',
			'country'
		]
	},
	
	getFullName: function() {
		return this.get('name') + ' ' + this.get('surname');
	}
});


//{
//	"title": "Эффективное лидерство",
//	"topic": "Создание надежного будущего",
//	"speakers": [
//		{
//			"name": "Выступление Президента Российской Федерации",
//			"post": "",
//			"avatar": "",
//			"country": "",
//			"id": 1
//		}
//	],
//	"id": 1,
//	"startDate": 1340258400000,
//	"endDate": 1340262000000,
//	"day": "21 июня"
//}