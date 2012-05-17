#!/usr/bin/env node

var common  = require ('common'),
	httpdi  = require ('initiator/http'),
	timeri = require('initiator/timer'),
	callbacki = require('initiator/callback'),
	socketi  = require ('initiator/socket'),
	util    = require ('util'),
	barrier = require ('barrier'),
	urlUtil = require ('url'),

	querystring = require('querystring'),
	task = require('task/base'),
	workflow = require('workflow'),
	iconv = require('iconv').Iconv;
	
var converter = new iconv('windows-1251', 'utf-8'),
	timeout = 200,
	companyIds = ["1519","7785","8085","7805","1435","8233","8617","8801","8529","8793","8257","8473","8761","7913","8461","7697","8245","8633","8089","8209","7781","8113","8093","8417","12240","8321","8313","8405","8889","7813","8785","8157","8201","8649","7653","7817","7633","12715","8005","7953","8597","63715","8869","12219","8173","1423","7669","12727","8389","7985"],
	companyTickers = {
		"1519": "RUALR | RUALRS | SBER | SBERG | SBERP | SBERPG | SBERPS | SBERS | SBNA",
		"7785": "81JK | GAZ | GAZP | GAZP09 | gazp11 | gazp13 | GAZPS | GSPBEX | OGZD | OGZPF | RU000A0DY3S2 | RU000A0GDJM1 | RU000A0JNTT8 | RU000A0JNTU6 | RU000A0JP203 | RU000A0JQ6T7 | RU000A0JQ6U5",
		"8085": "68FV | LKOD | LKOE | LKOH | LKOH02 | LKOH03 | LKOH04 | LKOHG | LKOHS | LKOR | LUK | LUKOY | RU000A0DGFW8 | RU000A0JNYY8 | RU000A0JNZ11 | RU000A0JQ6J8 | RU000A0JQ6K6 | RU000A0JQ6L4 | RU000A0JQ995 | RU000A0JQ9A1 | RU000A0JQ9B9 | RU000A0JQ9C7 | RU000A0JQ9D5 | RU000A0JQN38 | RU000A0JQN46",
		"7805": "GMKN | GMKNG | GMKNS | MNOD | NILSY | NNIA | RU000A0JQYY1",
		"1435": "36GK | KYM1 | RU000A0AXJM2 | RU000A0GHL00 | RU000A0JNGU3 | RU000A0JQT99 | RU000A0JQTA1 | RU000A0JQTB9 | RU000A0JS1M1 | RU000A0JS1P4 | RU000A0JS1T6 | RU000A0JS1U4 | VTBR | VTBR-002D | VTBR04 | VTBR05 | VTBR06 | VTBRG | VTBRS",
		"8233": "ROSN | 40XT | OJS1 | ROSNG | ROSNS",
		"8617": "SGGD | SGN | SGNV | SNGS | SNGSG | SNGSP | SNGSPG | SNGSPS | SNGSS",
		"8801": "MRKH | MRKH-001D | MRKHG | MRKHP | MRKHPG",
		"8529": "50AW | CHMF | CHMFG | CHMFS | RTS2 | RU000A0JQCC3 | RU000A0JQSK2 | RU000A0JQSL0 | SVST",
		"8793": "FEES | FEES02 | FEES03 | FEES04 | FEES05 | FEESG | FEESS | RU000A0E6X12 | RU000A0GKZK6 | RU000A0JNPX8 | RU000A0JNXY0 | RU000A0JR1Y7 | RU000A0JR1Z4 | RU000A0JR209 | RU000A0JR217 | RU000A0JR3L0 | RU000A0JR3M8 | RU000A0JRL96 | RU000A0JRMX6 | RU000A0JRUS9 | RU000A0JRZK5",
		"8257": "N7MG | NLMA | NLMK | NLMKG | NLMKS | RU000A0JQH93 | RU000A0JQHA6 | RU000A0JQHB4 | RU000A0JRW10 | RU000A0JS1C2 | RU000A0JS1D0",
		"8473": "HYDR | HYDR-037D | HYDR-038D | HYDR-039D | HYDR-040D | HYDRG | HYDRS | RG2 | RU000A0JRFN1 | RU000A0JRFP6",
		"8761": "50TY | M6B1 | RU000A0JR8M7 | URKA | URKA-004D | URKA-005D | URKAG | URKAS",
		"7913": "IRAO | IRAO-001D | IRAO-003D | IRAO-004D | IRAOG | IUES-001D | IUES-002D",
		"8461": "RKMD | RTKM | RTKM-002D | RTKM-003D | RTKM-004D | RTKM-005D | RTKM-006D | RTKM-007D | RTKM-008D | RTKM-009D | RTKM-010D | RTKM-011D | RTKM-012D | RTKM-013D | RTKM-014D | RTKM-015D | RTKM-016D | RTKM-017D | RTKMG | RTKMP | RTKMPG | RTL | RU000A0JRDE5 | RU000A0JRDF2 | RU000A0JRDG0 | RU000A0JRDH8 | RU000A0JRDJ4 | RU000A0JRDK2 | RU000A0JRDL0 | RU000A0JRDM8 | RU000A0JRDP1 | RU000A0JRDQ9 | RU000A0JRDR7 | RU000A0JRDS5 | RU000A0JRDT3 | RU000A0JRDU1",
		"7697": "AETG | AFLT | AFLTG | RU000A0JQU88 | RU000A0JQU96",
		"8245": "4B02-02-00268-E | 4B02-03-00268-E | 4B02-04-00268-E | 65DB | N1O | NVTK | NVTKG | NVTKS | RU000A0JQXB1",
		"8633": "ATAD | RU000A0JR1T7 | TATN | TATNG | TATNP | TATNPG | TATNS | TTFB",
		"8089": "50XD | 5M71 | MGNT | MGNT-004D | MGNT-005D | MGNT-006D | MGNTG | RU000A0JR118 | RU000A0JR126 | RU000A0JR142 | RU000A0JR159 | RU000A0JR9N3 | RU000A0JRFQ4",
		"8209": "MKY | MTSI-002D | MTSS | mtss01 | mtss02 | mtss03 | mtss04 | mtss05 | MTSSG | MTSSS | RU000A0JPTJ4 | RU000A0JQ0D4 | RU000A0JQ0E2 | RU000A0JQ5E1 | RU000A0JQ8Q9 | RU000A0JR4H6 | RU000A0JR4J2",
		"7781": "GAZ | RU000A0JQ557 | RU000A0JQ8H8 | RU000A0JQUB7 | RU000A0JQUC5 | RU000A0JR852 | RU000A0JR860 | RU000A0JR878 | RU000A0JS3B0 | SCF | SIBN | sibn03 | sibn04",
		"8113": "MHSA | MTLR | MTLR02 | mtlr04 | mtlr05 | MTLRG | MTLRP | MTLRPG | RU000A0GUBF6 | RU000A0JQ8V9 | RU000A0JQFQ6 | RU000A0JQJG9 | RU000A0JQT65 | RU000A0JQV20 | RU000A0JR0J0 | RU000A0JR0K8 | RU000A0JR8L9 | RU000A0JR8P0 | RU000A0JRJS2 | RU000A0JRJT0 | RU000A0JRJY0 | RU000A0JS3R6 | RU000A0JS6E7 | RU000A0JS6F4 | RU000A0JS6G2 | RU000A0JS6H0 | RU000A0JS6J6",
		"8093": "42CL | MAGN | MAGNG | MAGNS | MHQ | MMK | RU000A0JQJV8 | RU000A0JQN12 | RU000A0JQU05 | RU000A0JR1L4 | RU000A0JR9M5 | RU000A0JRM87 | RU000A0JRMZ1 | RU000A0JS3T2",
		"8417": "RASP | RASPG",
		"12240": "TNBP | TNBPP",
		"8321": "EONR | EONRG",
		"8313": "37O1 | 54UQ | OGK2 | OGKB | OGKB-004D | ogkb01 | OGKBG | RU000A0JPBB9 | RU000A0JRUZ4",
		"8405": "P6J2 | PLZL | PLZLG | PLZLS",
		"8889": "AFKS | afks01 | afks02 | afks03 | KO71 | RU000A0JPNX8 | RU000A0JQ9U9 | RU000A0JQL30 | RU000A0JRBU5 | SSA | SSAA",
		"7813": "3LSA | 54UD | LSRG | lsrg02 | LSRGG | RU000A0JPXB3 | RU000A0JQXD7 | RU000A0JR1B5 | RU000A0JRB31 | RU000A0JRCC1 | RU000A0JRN45",
		"8785": "70SK | GO12 | PHST | PHSTG",
		"8157": "AOMD | MRO | MSNG | MSNG01 | MSNG02 | msng03 | MSNGG | RU000A0GN9B5 | RU000A0JNMN6 | RU000A0JQAD5 | RU000A0JQLM3",
		"8201": "MRKC | MRKCG",
		"8649": "RU000A0JP435 | RU000A0JQ722 | RU000A0JS1W0 | RU000A0JS470 | TGKA | tgka01 | TGKA-010D | TGKA-011D | tgka02 | TGKAG",
		"7653": "34NF | AKRN | akrn02 | akrn03 | RU000A0JQCK6 | RU000A0JQK80 | RU000A0JRHF3 | RU000A0JRHG1",
		"7817": "GRAZ | GRAZG | RU000A0JPR01 | RU000A0JPU06 | RU000A0JPZS2 | RU000A0JPZT0 | RU000A0JPZW4 | RU000A0JPZX2 | RU000A0JQ151 | RU000A0JQ1U6 | RU000A0JQ219 | RU000A0JQTE3 | RU000A0JQTG8 | RU000A0JQTX3 | RU000A0JQU21 | RU000A0JRFS0 | RU000A0JRK14",
		"7633": "AVAZ | AVAZ03 | AVAZ04 | AVAZP | AVVG | RU000A0AVHH0 | RU000A0E6X20 | RU000A0JP8V0 | RU000A0JPPD5 | RU000A0JPPE3 | RU000A0JPSD9 | RU000A0JPSV1",
		"12715": "PRTK | PRTKG",
		"8005": "VSMO | VSMOG",
		"7953": "KMAZ | KMAZG | RU000A0JR670 | RU000A0JR886",
		"8597": "RU000A0AU608 | RU000A0JPCB7 | RU000A0JQUW3 | SVAV | SVAV01 | svav02 | SVAVG",
		"63715": "RBCM | RBCMG | RU000A0JQVB5 | RU000A0JQVC3 | RU000A0JQVD1 | RU000A0JQVE9 | RU000A0JQVF6 | RU000A0JQVG4",
		"8869": "UKUZ | UKUZG",
		"12219": "ALRS | RU000A0JQVK6 | RU000A0JQX02 | RU000A0JQX10 | RU000A0JQXE5",
		"8173": "MSRS | MSRS-001D | MSRS01 | MSRS01G | MSRSG | RU000A0JNL41",
		"1423": "BSPB | BSPBG | BSPBP | bspbpa | BSPBPG | RU000A0GTKE2 | RU000A0JQU54 | RU000A0JR1P5 | RU000A0JR5T8",
		"7669": "APTK | APTK01 | RU000A0JNFZ4 | RU000A0JQ631",
		"12727": "ZOYA",
		"8389": "PKBA | PKBAG | PKBAP | PKBAPG",
		"7985": "MVID | MVIDG"
	};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

module.exports = {
	
	parseQuery: function (config) {
		
		var query = {};
		
		query = urlUtil.parse (config.url).query;

		try {
			
			var sort = [];
			
			JSON.parse(query.sort).map(function(pair) {
					
				var arr = [];
				
				for (var key in pair) {
					arr.push(pair[key].toLowerCase());
				}
				
				if (arr.length) {
					if (arr.length == 1) sort.push(arr[0]);
					else sort.push(arr);
				}					
			});
			
			query.sort = sort;
		}	
		catch (e) {
			query.sort = [];
		}
				
		try {

			var filter = {};
				
			JSON.parse(query.filter).forEach(function(pair) {
				filter[pair.property] = pair.value;
			});
			
			query.filter = filter;
		}
		catch (e) {
			query.filter = {};
		}
		
		var user = config.user;
		
		if (user) {
			query.filter['author.userId'] = user._id;
		}
		
		return query;
	},
	
	parseFilter: function(config) {
		
		var query = module.exports.parseQuery(config);
		
		var newQuery = {};
		util.extend(newQuery, query);
		
		var result;
		
		if (query.filter.type != '@') {
			
			newQuery.filter = {type: query.filter.type, text: {"$regex": new RegExp('^'+query.filter.text)}};
			query.tag = newQuery;

		} else if (query.filter.type == '@') {

			newQuery.filter = query.filter.text;
			query.person = newQuery;

		}
		
		return query;	
	},
	
	updateTags: function(config) {
		
		if (config.mongoResponse.success) {
			config.data.tags = config.mongoResponse.data;
		}
		
		return module.exports.addUserData(config);
	},
	
	addUserData: function(config) {
		
		var data = config.data;
		
		var user = config.user;
		
		var author = {
			userId: user._id,
			name: user.name
		};
		
		data.author = author;
		
		return data;
	},
	
	compose: function(config) {
		
		var result = {};
		
		result.filter = config.filter;

		result.success = config.dataResponse.success || false;
		result.total = config.dataResponse.total || 0;
		result.err = config.dataResponse.err || null;

		result.data = config.dataResponse.data;		

		return result;	
	},
	
	getProfile: function (config) {
		var result = {};
		var user = config.request.user;
		if (user) {
			util.extend(result, user);
			delete result.tokens;
			delete result.sessionUIDs;
		} else {
			result.statusCode = 401;
			result.err = 'User not authorized';
		}

		return result;
	},
	
	getTickers: function(config) {
		
		var closure = function(i) {
			
			var id = companyIds[i];
		
			project.callbackInitiator.process ("tickers", {
					companyId: id,
					url: "http://emitent.1prime.ru/EmitentPages/EmitentCompareFoTickerIntradayGrid.aspx",
					headers: {
						"Content-Type": "application/estyle-xml-request",
						"Origin": "http://emitent.1prime.ru",
						"Referer": "http://emitent.1prime.ru/EmitentPages/EmitentQuotesIntraday.aspx?EmitentId=" + id
					},
					body: '<request><pageNumber>1</pageNumber>'
						+'<isEmitentCard>1</isEmitentCard><groupExchangeList>2 </groupExchangeList>'
						+'<groupInstrumentTypeList>1</groupInstrumentTypeList><idList>'
						+id
						+'</idList><showCol>Name ExchangeName Code ActionName Last High Low ChangeProc Bid_ Ask WA Trade VDay VRub VDol</showCol>'
						+'<parentId>EmitentQuotesIntraday</parentId></request>'
			});
			
			if (i < companyIds.length) setTimeout(function() {
				closure(i+1);
			}, timeout);
	
		};
			
		closure(0);
	},
	
	getNews: function(config) {
		
		var closure = function(i) {
			
			var id = companyIds[i],
				tickers = companyTickers[id];
			
			project.callbackInitiator.process ("news", {
					companyId: id,
					url: "http://emitent.1prime.ru/News/NewsSearchGrid.aspx",
					headers: {
						"Content-Type": "application/estyle-xml-request",
						"Origin": "http://emitent.1prime.ru",
						"Referer": "http://emitent.1prime.ru/EmitentPages/EmitentNewsArchive.aspx?EmitentId=" + id
					},
					body: '<request><pageNumber>1</pageNumber><rowsOnPage>10</rowsOnPage>'
					+ '<orderCondition><order/></orderCondition><forExcel>0</forExcel><forWord>0</forWord>'
					+ '<DateFrom></DateFrom><DateTo></DateTo><SearchNews></SearchNews>'
					+ '<Tickers>' + tickers + '</Tickers></request>'
			});
			
			if (i < companyIds.length) setTimeout(function() {
				closure(i+1);
			}, timeout);
			
		};
		
		closure(0);
		
	},
	
	getComments: function(config) {
		
		var closure = function(i) {
		
			var id = companyIds[i],
				tickers = companyTickers[id];
			
			project.callbackInitiator.process ("comments", {
					companyId: id,
					url: "http://emitent.1prime.ru/Comments/CommentsSearchGrid.aspx",
					headers: {
						"Content-Type": "application/estyle-xml-request",
						"Origin": "http://emitent.1prime.ru",
						"Referer": "http://emitent.1prime.ru/EmitentPages/EmitentAnalystComments.aspx?EmitentId=" + id
					},
					body: '<request><pageNumber>1</pageNumber>'
					+'<rowsOnPage>30</rowsOnPage><orderCondition><order/></orderCondition>'
					+'<forExcel>0</forExcel><forWord>0</forWord><DateFrom></DateFrom><DateTo></DateTo>'
					+'<SearchComments></SearchComments>'
					+'<Tickers>' + tickers + '</Tickers></request>'
			});
			
			if (i < companyIds.length) setTimeout(function() {
				closure(i+1);
			}, timeout);
			
		};
		
		closure(0);
	},
	
	parseDate: function(str) {
		var date = new Date();
		var result = str.match(/(\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d)\:(\d\d)/);
		
		date.setDate(result[1]);
		date.setMonth(result[2]-1);
		date.setYear(result[3]);
		
		date.setHours(result[4]);
		date.setMinutes(result[5]);
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return ~~(date.getTime()/1000);
	},
	
	parseTicker: function(config) {
		
		var textData = converter.convert(config.responseText.data).toString('utf-8');
		
		var startSplitter = "<table id='GridBuilderTicker_headTable' style='WIDTH:100%;' class='grid-header' border='0'>",
			endSplitter = "</table></div>",
			trStartSplitter = "</th></tr><tr id='0' class='even-row'>",
			trEndSplitter = "</td></tr>",
			tdSplitter = /<\/td><td .+?>/gi,
			divSplitter = /<div .+?>(\w+)<\/div>/,
			cellNames = 'exchangeName code actionName date last high low changeProc bid ask wa trade vDay vRub vDol'.split(' '),
			result = {};
			
		try {
			textData = textData.split(startSplitter)[1].split(endSplitter)[0].split(trStartSplitter)[1].split(trEndSplitter)[0];
			var data = textData.split(tdSplitter);
			data.shift();
			data[1] = data[1].match(divSplitter)[1];
			data[3] = (data[3]) ? module.exports.parseDate(data[3]) : null;
			
			data.map(function(item, index) {
				
				if (index > 3 && item) {
					item = item.replace(/ /gi,'');
					item = parseFloat(item);
				}
				
				result[cellNames[index]] = item;
			});
			
			result._id = parseInt(config.companyId);
		}
		catch (e) {
			console.log('!!!!!!!!!!!!!!!!!!!!!!!!', config.companyId, e.message, textData);
			return null;
		}
		
		return result;
	},
	
	parseNews: function(config) {
		
		var textData = converter.convert(config.responseText.data).toString('utf-8');
		
		textData = textData.replace(/&quot;/g, '"');
		textData = textData.replace(/&nbsp;/g, ' ');
		
		var startSplitter = "<table id='GridBuilderNews_headTable' style='WIDTH:100%;' class='grid-header' border='0'><colgroup><col width=100%/></colgroup>",
			endSplitter = "</table></td></tr>",
			trSplitter = "</tr>",
			contentRegExp = /title='(.+?)' class='news_text'.+(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d)</,
			cellNames = 'title date'.split(' '),
			result = {},
			news;
			
		try {
			
			textData = textData.split(startSplitter)[1].split(endSplitter)[0];
			
			var trData = textData.split(trSplitter);
			
			result.news = [];
			
			trData.map(function(tr) {
				
				var matchRes = tr.match(contentRegExp);
				
				if (!matchRes) return;
				
				matchRes.shift();
				
				news = {};
				
				matchRes.map(function(match, i) {
					news[cellNames[i]] = match;
				});
				
				news.date = module.exports.parseDate(news.date);
								
				result.news.push(news);
			});
			
			result._id = config.companyId;
		}
		catch (e) {
			return null;
		}
		
		return result;
	},
	
	parseComment: function(config) {
		
		var textData = converter.convert(config.responseText.data).toString('utf-8');
			
		textData = textData.replace(/&quot;/g, '"');
		textData = textData.replace(/&nbsp;/g, ' ');
		
		var startSplitter = "<table id='GridBuilderComments_headTable' style='WIDTH:100%;' class='grid-header' border='0'><colgroup><col width=100%/></colgroup>",
			endSplitter = "</table></td>",
			trSplitter = '</tr>',
			contentRegExp = /title='(.+?)' class='news_text'.+<font class="time">\/(.+)<\/font.+p class="cont_txt">(.+)<a style/,
			cellNames = 'title date lead'.split(' '),
			result = {},
			comment;
			
		try {
			textData = textData.split(startSplitter)[1].split(endSplitter)[0];
			
			var trData = textData.split(trSplitter);
			
			result.comments = [];
			
			trData.map(function(tr) {
				
				var matchRes = tr.match(contentRegExp);
				
				if (!matchRes) return;
				
				matchRes.shift();
				
				comment = {};
				
				matchRes.map(function(match, i) {
					comment[cellNames[i]] = match;
				});
				
				comment.date = module.exports.parseDate(comment.date);
								
				result.comments.push(comment);				
			});
			
			result._id = config.companyId;
		}
		catch (e) {
			return null;
		}
		
		return result;
	}
};

// - - -

project.on ('ready', function () {
	
	var httpdiConfig = project.config.initiator.httpd;
	httpdiConfig.static.root = project.root.fileIO ('htdocs');
	
	var initiatorConfig = project.config.initiator,
		timeriConfig = initiatorConfig.timerd,
		callbackiConfig = initiatorConfig.callbackd,
		socketiConfig = initiatorConfig.socketd;
		
	// prepare configs
	
	defaultSharingGroupId = project.config.consumerConfig.facebook.defaultSharingGroupId;

	// httpdi
	
	project.httpInititator = new httpdi (httpdiConfig);
	
	// timeri
	
	project.timerInitiator = new timeri(timeriConfig);
	
	// callbacki
	
	project.callbackInitiator = new callbacki(callbackiConfig);
	
	// socketi
	
	project.socketInititator = new socketi (socketiConfig);

});
