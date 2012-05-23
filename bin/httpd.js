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
    timeout = 200;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

module.exports = {
    getTimestamp: function(config){
        //console.log(config.data);
        return ~~(Date.now()/1000);
    },
    checkMonitor: function(config){
        var curTimestamp = config.curTimestamp;
        var data = config.records.data;
        var monitorTimeOut = project.config.consumerConfig.monitorTimeOut;
        
        var monitorStatus = [];
        for(key in data)
        {
            if(curTimestamp - data[key].updated > monitorTimeOut)
            {
                monitorStatus.push({'sid':data[key]._id,'status':false});
            }
            else
            {
                monitorStatus.push({'sid':data[key]._id,'status':true});
            }
        }
        return monitorStatus;
    }
};

// - - -

project.on ('ready', function () {
	
	var httpdiConfig = project.config.initiator.httpd;
	httpdiConfig.static.root = project.root.fileIO ('htdocs');
	
	var initiatorConfig = project.config.initiator;
		
	// prepare configs
	
	// httpdi
	
	project.httpInititator = new httpdi (httpdiConfig);
});
