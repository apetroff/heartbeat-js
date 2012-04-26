#!/usr/bin/env node

var common  = require ('common');
var httpdi  = require ('initiator/http');
var socketi  = require ('initiator/socket');
var util    = require ('util');
var barrier = require ('barrier');
var urlUtil = require ('url');

var querystring = require('querystring');
var task = require('task/base');
var workflow = require('workflow');

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
	}
};

// - - -

project.on ('ready', function () {
	
	var httpdiConfig = project.config.initiator.httpd;
	httpdiConfig.static.root = project.root.fileIO ('htdocs');
	
	var socketiConfig = project.config.initiator.socketd;
	
	// - - - prepare configs
	
	defaultSharingGroupId = project.config.consumerConfig.facebook.defaultSharingGroupId;

	// - - - -
	
	var httpInititator = new httpdi (httpdiConfig);
	
	// - - - -
	
	var socketInititator = new socketi (socketiConfig);

});
