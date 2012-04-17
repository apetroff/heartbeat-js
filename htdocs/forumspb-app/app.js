//<debug>
Ext.Loader.setPath({
    'Ext': '/a/lib/sencha-touch-2/src',
    'Spief': 'app'
});
//</debug>

Ext.Date.dayNames = Ext.DateExtras.dayNames = 'Понедельник Вторник Среда Четверг Пятница Суббота Воскресенье'.split(' ');
Ext.Date.monthNames = Ext.DateExtras.monthNames = 'Января Февраля Марта Апреля Мая Июня Июля Августа Сентября Октября Ноября Декабря'.split(' ');

Ext.require(['Spief.util.Proxy']);

Ext.application({
    // Change the values below to re-configure the app for a different conference.

    title:   'ПЭМФ-2012',
    dataUrl: 'http://2012.forumspb.com/index_ru.html',

    mapCenter: [59.928294,30.236024],
    mapText: '<h1>Lenexpo</h1><small>Васильевский остр., Большой пр., 103<br />г. Санкт-Петербург, Россия, 199106<br />+7 812 321-26-15 ‎</small>',
	
    aboutPages: [
        {
            title: 'ПМЭФ-2012',
            xtype: 'htmlPage',
            url: 'data/about.html'
        },
        {
            title: 'Партнеры',
            xtype: 'htmlPage',
            url: 'data/partners.html'
        },
        {
            title: 'Карта',
            xtype: 'location'
        },
		{
            title: 'О программе',
            xtype: 'htmlPage',
            url: 'data/credits.html'
        }
    ],
	
	companyAdditionalPages: [
        {
            title: 'Краткая информация',
            xtype: 'list',
        },
		{
            title: 'Описание деятельности',
            xtype: 'container'
        },
        {
            title: 'Новости',
            xtype: 'list'
        },
		{
            title: 'Комментарии',
            xtype: 'list'
        },
		{
            title: 'Документы',
            xtype: 'list'
        }
    ],

    // App namespace

    name: 'Spief',

    phoneStartupScreen:  'resources/img/startup.png',
    tabletStartupScreen: 'resources/img/startup_640.png',

    glossOnIcon: false,
    icon: {
        57: 'resources/img/icon.png',
        72: 'resources/img/icon-72.png',
        114: 'resources/img/icon-114.png'
    },

    // Dependencies

    requires: ['Spief.util.Proxy'],

    models: [
        'Session',
        'Speaker',
		'Company',
		'ExtendedCompany'
    ],

    views: [
        'Main',

        'session.Card',
        'session.List',
        'session.Detail',
        'session.Info',

        'speaker.Card',
        'speaker.List',
        'speaker.Detail',
        'speaker.Info',

        'companies.Card',
		'companies.List',
		'companies.AdditionalList',
		'companies.Detail',
        'companies.Info',
		
        'about.Location',
        'about.Card',
        'about.List',
        'about.HtmlPage'
    ],

    controllers: [
        'Sessions',
        'Speakers',
        'Companies',
        'About'
    ],

    stores: [
        'Sessions',
        'SpeakerSessions',
        'Speakers',
        'SessionSpeakers',
        'Companies',
		'ExtendedCompanies',
    ],

    viewport: {
        autoMaximize: true
    },

    launch: function() {

        Ext.Viewport.setMasked({ xtype: 'loadmask', message: 'Загрузка...' });
		
		Spief.util.Proxy.process('data/sessions.js', function() {
            Ext.Viewport.add({ xtype: 'main' });
            Ext.Viewport.setMasked(false);
        });
    }

});
