Ext.define('Spief.model.Session', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			'id',
			'title',
			'topic',
			{
				name: 'startDate',
				type: 'date',
			},
			{
				name: 'startDate',
				type: 'date',
			},
			'speakerIds'
		]
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