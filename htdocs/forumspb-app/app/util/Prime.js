Ext.define('Spief.util.Prime', {
	
	singleton: true,
	
	config: {
		
		basic: ['description', 'info', 'docs'],
		additional: ['daily', 'yearly', 'news', 'comments'],
		
		defaults: {
			method: 'POST',
			proxyUrl: 'http://collaboratoria.local/proxy/post?url={url}&headers={headers}',
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
		this.callParent();
		console.log ('constructor', config);
	},
	
	process: function(id, all, callback, scope) {
		
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
	
	processDescription: function(responseText, callback) {
	
	},
	
	processInfo: function(responseText, callback) {
	
	},
	
	processDaily: function(responseText, callback) {
	
	},
	
	processYearly: function(responseText, callback) {
	
	},
	
	processNews: function(responseText, callback) {
	
	},
	
	processComments: function(responseText, callback) {
	
	},
	
	processDocs: function(responseText, callback) {
	
	}
	
});
