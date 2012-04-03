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

var defaultSharingGroupId;

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
			
			var userId = user.email;
			var shared = (user.groupIds && user.groupIds.indexOf(defaultSharingGroupId) >= 0);
			
			if (shared) {
				query.filter['$or'] = [ {userId: userId} , {shared: 1}];
			} else {
				query.filter.userId = userId;
			}
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
//		else if (query.filter.type == '$') {
//
//			query.share = newQuery;
//			query.share = {type: query.filter.type, text: {"$regex": new RegExp('^'+query.filter.text)}};;
//
//		}
		
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
		var shared = (user.groupIds.indexOf(defaultSharingGroupId) >= 0);
		
		var author = {
			userId: user.userId,
			name: user.name,
			avatar: user.avatar
		};
		
		data.author = author;
		data.shared = ~~(shared);

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
		if (user && user.email && user.name) {
			result.email = user.email;
			result.name = user.name;
			result.avatar = user.avatar || '';
		} else {
			result.statusCode = 401;
			result.err = 'User not authorized';
		}

		return result;
	}
};

// - - -

var prepareConfig;

function requestHandler(req, res, basicWf) {
	
	var prepare = basicWf.prepare;
	
	if (prepare) {
		
		if (prepareConfig) {
			
			var wfChain = [];
			
			// create chain of wfs
		
			prepare.forEach(function(p, index, arr) {
				
				var innerWfConfig = prepareConfig[p];
				var innerWf = new workflow(innerWfConfig, {request: req, response: res, stage: 'prepare'});
				
				wfChain.push(innerWf);
				
			});
			
			// push basic wf to chain
			
			wfChain.push(basicWf)
			
			// subscribe they
			
			for (var i = 0; i < wfChain.length-1; i++) {
			
				var currentWf = wfChain[i];
				currentWf.nextWf = wfChain[i+1];
				
				currentWf.on('completed', function(cWF) {
					
					setTimeout(cWF.nextWf.run.bind (cWF.nextWf), 0);
				
				});
				
				currentWf.on('failed', function(cWF) {
				
					console.log ('failed', cWF.id);
				
				})
			
			}
			
			wfChain[0].run();
		
		} else {
			
			throw "Config doesn't contain such prepare type: " + wf.prepare;
			
		}
		
	}	
}

// ----------------------------------------

project.on ('ready', function () {
	
	var httpdiConfig = project.config.initiator.httpd;
	httpdiConfig.static.root = project.root.fileIO ('htdocs');
	
	var socketiConfig = project.config.initiator.socketd;
	
	// - - - prepare configs
	
	defaultSharingGroupId = project.config.consumerConfig.facebook.defaultSharingGroupId;

	prepareConfig = project.config.prepare;
	
	// - - - -

	
	var httpInititator = new httpdi (httpdiConfig);
	
	httpInititator.on('detected', requestHandler);
	
	// - - - -
	
	var socketInititator = new socketi (socketiConfig);

});
