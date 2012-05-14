#!/usr/bin/env node

var common  = require ('common'),
	httpdi  = require ('initiator/http'),
	timeri = require('initiator/timer'),
	socketi  = require ('initiator/socket'),
	util    = require ('util'),
	barrier = require ('barrier'),
	urlUtil = require ('url'),

	querystring = require('querystring'),
	task = require('task/base'),
	workflow = require('workflow');

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
		
		console.log (query);		
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
	
	getAllIndexes: function() {
		var ids = ["1519","7785","8085","7805","1435","8233","8617","8801","8529","8793","8257","8473","8761","7913","8461","7697","8245","8633","8089","8209","7781","8113","8093","8417","12240","8321","8313","8405","8889","7813","8785","8157","8201","8649","7653","7817","7633","12715","8005","7953","8597","63715","8869","12219","8173","1423","7669","12727","8389","7985"];
		
		ids.map(function(id) {
		
		var wf = this.app.process ("ticker", {
			url: ''
			headers: {
				Referer: 
			},
			body: ''
		});
		
		});
		
		return ids;
	},
	
	parseIndex: function() {
		var responseText = config.responseText;
	}
};

// - - -

project.on ('ready', function () {
	
	var httpdiConfig = project.config.initiator.httpd;
	httpdiConfig.static.root = project.root.fileIO ('htdocs');
	
	var timeriConfig = project.config.initiator.timerd;
	
	var socketiConfig = project.config.initiator.socketd;
	
	// prepare configs
	
	defaultSharingGroupId = project.config.consumerConfig.facebook.defaultSharingGroupId;

	// httpdi
	
	var httpInititator = new httpdi (httpdiConfig);
	
	// timeri
	
	var timerInitiator = new timeri(timeriConfig);
	
	// socketi
	
	var socketInititator = new socketi (socketiConfig);

});
