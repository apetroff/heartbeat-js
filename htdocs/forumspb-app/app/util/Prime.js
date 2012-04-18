Ext.define('Spief.util.Prime', {
	
	singleton: true,
	
	config: {
		
		basic: ['description', 'info', 'docs'],
		additional: ['daily', 'yearly', 'news', 'comments'],
		
		defaults: {
			method: 'POST',
			proxyUrl: 'http://collaboratoria.local/proxy/post',
			headers: {
				"Content-Type": "application/estyle-xml-request",
				"Origin": "http://emitent.1prime.ru"
			}
		},
		
		description: {
			
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentActivitiesGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentActivities.aspx?EmitentId={id}'
			},
			request: '<request><EmitentId>{id}</EmitentId></request>',
			dataSelector: 'table#GridBuilderGeneral_headTable'
			
		},
		info: {
		
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentGeneralGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentGeneral.aspx?EmitentId={id}'
			},
			request: '<request><EmitentId>{id}</EmitentId></request>',
			dataSelector: 'table#GridBuilderGeneral_headTable'
			
		},
		dailyAll: {
			
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentCompareFoTickerResultsByDateGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentCompareFoTickerBlueChip.aspx'
			},
			request: '<request><pageNumber>1</pageNumber><rowsOnPage>50</rowsOnPage><orderCondition><order/></orderCondition><forExcel>0</forExcel><forWord>0</forWord><compareDate>{today}</compareDate><groupExchangeList>2 </groupExchangeList><groupInstrumentTypeList>1 </groupInstrumentTypeList><idList>{ids}</idList><showCol>Name ADate ExchangeName Code ActionName Close High Low ChangeProc Bid_ Ask WA Trade VDay VRub VDol</showCol><isBlueChip>1</isBlueChip><parentId>EmitentCompareFoTickerBlueChip</parentId></request>',
			dataSelector: 'table#GridBuilderTicker_headTable'
			
		},
		daily: {
			
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentCompareFoTickerIntradayGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentQuotesIntraday.aspx?EmitentId={id}'
			},
			request: '<request><isEmitentCard>1</isEmitentCard><groupExchangeList>2 </groupExchangeList><groupInstrumentTypeList>1 </groupInstrumentTypeList><idList>{id}</idList><showCol>Name ExchangeName Code ActionName Last High Low ChangeProc Bid_ Ask WA Trade VDay VRub VDol</showCol><parentId>EmitentQuotesIntraday</parentId></request>',
			dataSelector: 'table#GridBuilderTicker_headTable'
			
		},
		yearly: {
			
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentCompareFoTickerResultsByDateGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentQuotesArchive.aspx?EmitentId={id}'
			},
			request: '<request><compareDate>{date}</compareDate><isEmitentCard>1</isEmitentCard><groupExchangeList>2 </groupExchangeList><groupInstrumentTypeList>1 </groupInstrumentTypeList><idList>{id}</idList><showCol>Name ADate ExchangeName Code ActionName Close High Low ChangeProc Bid_ Ask WA Trade VDay VRub VDol</showCol><parentId>EmitentQuotesArchive</parentId></request>',
			dataSelector: 'tr#{id} td'
			
		},
		news: {
			
			url: 'http://emitent.1prime.ru/News/NewsSearchGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentNewsArchive.aspx?EmitentId={id}'
			},
			request: '<request><pageNumber>1</pageNumber><rowsOnPage>10</rowsOnPage><orderCondition><order/></orderCondition><forExcel>0</forExcel><forWord>0</forWord><DateFrom></DateFrom><DateTo></DateTo><SearchNews></SearchNews><Tickers>{tickers}</Tickers></request>',
			dataSelector: 'table#GridBuilderNews'
			
		},
		comments: {
			
			url: 'http://emitent.1prime.ru/Comments/CommentsSearchGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentAnalystComments.aspx?EmitentId={id}'
			},
			request: '<request><pageNumber>1</pageNumber><rowsOnPage>10</rowsOnPage><orderCondition><order/></orderCondition><forExcel>0</forExcel><forWord>0</forWord><DateFrom>{today}</DateFrom><DateTo>{today}</DateTo><SearchComments></SearchComments><Tickers>{tickers}</Tickers></request>',
			dataSelector: 'table#GridBuilderComments'
			
		},
		docs: {
			
			url: 'http://emitent.1prime.ru/EmitentPages/EmitentDocumentsFCSMGrid.aspx',
			headers: {
				"Referer": 'http://emitent.1prime.ru/EmitentPages/EmitentDocumentsFCSM.aspx?EmitentId={id}'
			},
			request: '<request><pageNumber>1</pageNumber><rowsOnPage>10</rowsOnPage><orderCondition><order/></orderCondition><forExcel>0</forExcel><forWord>0</forWord><DateFrom>17.04.2011</DateFrom><DateTo>17.04.2012</DateTo><DocType>1</DocType><DocMessType>0</DocMessType><EmitentId>{id}</EmitentId></request>',
			dataSelector: 'table#GridBuilderGeneral'
			
		}
	},
	
	constructor: function(config) {
		
		this.callParent(config);
		this.reactor = new Ext.get('reactor');
	},
	
	process: function(url, callback) {

		var me = this,
			companyModel;
		
		this.companiesIds = []
		
		this.companiesStore = Ext.getStore('Companies');
		this.extendedCompaniesStore = Ext.getStore('ExtendedCompanies');
		
		Ext.data.JsonP.request({
		    url: url,
		    callbackName: 'companiesCb',

		    success: function(data) {

		        Ext.Array.each(data.companies, function(company) {

		            me.companiesIds.push(company.id);
					
		            companyModel = Ext.create('Spief.model.Company', company);

		            me.companiesStore.add(companyModel);
		        });
				
				var date = new Date();
				
		        me.load('dailyAll', {
					ids: me.companiesIds.join(' '),
					today: Ext.Date.format(date, 'd.m.Y')
				}, callback);
		    }
		});
	},
	
	getRequest: function(branch, data) {
	
		var branchConfig = this.config[branch],
			defaultConfig = this.config.defaults;
			
		// header compile/render & merge
		
		var refererTpl = branchConfig.headers['Referer'];
		
		if (refererTpl.substring) {
			refererTpl = branchConfig.headers['Referer'] = new Ext.Template(refererTpl, {compile: true});
		}
		
		var headers = Ext.Object.merge(defaultConfig.headers, {'Referer': refererTpl.apply(data)});
		
		// request compile/render
		
		var requestTpl = branchConfig.request;
		
		if (requestTpl.substring) {
			requestTpl = branchConfig.request = new Ext.Template(requestTpl, {compile: true});
		}
		
		var request = requestTpl.apply(data);
		
		// proxyUrl compile/render
		
		var proxyUrl = defaultConfig.proxyUrl;
		
		// compose & return
		
		return {
			url: proxyUrl,
			method: defaultConfig.method,
			
			data: {
				url: branchConfig.url,
				headers: headers,
				request: request
			},
			
			selector: branchConfig.dataSelector
		}
	},
	
	processCompany: function(id, all, callback, scope) {
		
		callback.call(scope, {})
		
//		this.callback = callback;
//		this.scope = scope;
//		
//		console.log (this);
//		
//		if (all) {
//			this.loadBasic(id);
//		}
//		
//		this.loadAdditional(id);
	},
	
	load: function(branch, data, callback) {
		
		var me = this,
			request = this.getRequest(branch, data);
			
		Ext.Ajax.request({
					
			url: request.url,
			method: request.method,
			headers: {
				'Content-Type': 'application/json'
			},
			jsonData: request.data,
			
			success: function(response, opts) {
				me[branch+'Process'].call(me, response.responseText, request.selector, callback);
			},
			
			failure: function(response, opts) {
				callback({err: response.statusText});
			}
			
		});
	},
	
	descriptionProcess: function(responseText, selector, callback) {
	
	},
	
	infoProcess: function(responseText, selector, callback) {
	
	},
	
	dailyAllProcess: function(responseText, selector, callback) {
		
		this.reactor.dom.innerHTML = responseText;
		
		var data = this.reactor.dom.querySelector(selector);
		data.parentNode.removeChild(data);
		
		while (this.reactor.dom.childNodes.length) this.reactor.dom.removeChild(this.reactor.dom.firstChild); 
		
		console.log (data);
		
		callback({ok: 1, data: {}});
	},
	
	dailyProcess: function(responseText, selector, callback) {
		
	},
	
	yearlyProcess: function(responseText, selector, callback) {
	
	},
	
	newsProcess: function(responseText, selector, callback) {
	
	},
	
	commentsProcess: function(responseText, selector, callback) {
	
	},
	
	docsProcess: function(responseText, selector, callback) {
	
	}
	
});
