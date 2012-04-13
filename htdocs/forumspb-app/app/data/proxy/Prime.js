Ext.define('Spief.data.proxy.Prime', {
	extend: 'Ext.data.proxy.Server',
	alias: 'proxy.prime',
	
	config: {
        /**
         * @property {Object} actionMethods
         * Mapping of action name to HTTP request method. In the basic AjaxProxy these are set to
         * 'GET' for 'read' actions and 'POST' for 'create', 'update' and 'destroy' actions.
         * The {@link Ext.data.proxy.Rest} maps these to the correct RESTful methods.
         */
        actionMethods: {
            create : 'POST',
            read   : 'POST',
            update : 'POST',
            destroy: 'POST'
        },

        /**
         * @cfg {Object} headers
         * Any headers to add to the Ajax request. Defaults to undefined.
         */
        headers: {},

        /**
         * @cfg {Boolean} withCredentials
         * This configuration is sometimes necessary when using cross-origin resource sharing.
         * @accessor
         */
        withCredentials: false
    },

    /**
     * Performs Ajax request.
     * @protected
     */
    doRequest: function(operation, callback, scope) {
        
		var writer  = this.getWriter(),
            request = this.buildRequest(operation);

		console.log(operation, request);
        
		request.setConfig({
            headers        : this.getHeaders(),
            timeout        : this.getTimeout(),
            method         : this.getMethod(request),
            callback       : this.createRequestCallback(request, operation, callback, scope),
            scope          : this
        });

        if (operation.getWithCredentials() || this.getWithCredentials()) {
            request.setWithCredentials(true);
        }

        // We now always have the writer prepare the request
        request = writer.write(request);
		
		console.log(request);

        Ext.Ajax.request(request.getCurrentConfig());

        return request;
    },

    /**
     * Returns the HTTP method name for a given request. By default this returns based on a lookup on
     * {@link #actionMethods}.
     * @param {Ext.data.Request} request The request object
     * @return {String} The HTTP method to use (should be one of 'GET', 'POST', 'PUT' or 'DELETE')
     */
    getMethod: function(request) {
        return this.getActionMethods()[request.getAction()];
    },

    /**
     * @private
     * @param {Ext.data.Request} request The Request object
     * @param {Ext.data.Operation} operation The Operation being executed
     * @param {Function} callback The callback function to be called when the request completes.
     *        This is usually the callback passed to doRequest
     * @param {Object} scope The scope in which to execute the callback function
     * @return {Function} The callback function
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;

        return function(options, success, response) {
            me.processResponse(success, operation, request, response, callback, scope);
        };
    },
	
//	read: function(operation, callback, scope) {
//
//		console.log (operation,callback, scope);
		
//		var sessionStore = Ext.getStore('Sessions'),
//		    speakerStore = Ext.getStore('Speakers'),
//		    sessionSpeakerStore = Ext.getStore('SessionSpeakers'),
//		    speakerSessionStore = Ext.getStore('SpeakerSessions'),
//		    sessionIds, proposalModel, speakerModel, speakerSessions = {}, sessionId, speaker, sessionDays = {};
//
//		Ext.create('Ext.data.proxy.Ajax', {
//			config: {
//				url: 'users.json?hello=world',
//				model: 'User',
//				reader: 'xml'
//			}
//		});
//		
//		Ext.data.JsonP.request({
//		    url: url,
//		    callbackName: 'feedCb',
//
//		    success: function(data) {
//
//		        Ext.Array.each(data.proposals, function(proposal) {
//
//		            proposal.speakerIds = [];
//		            proposalModel = Ext.create('Spief.model.Session', proposal);
//
//		            Ext.Array.each(proposal.speakers, function(speaker) {
//		                proposal.speakerIds.push(speaker.id);
//
//		                speakerModel = Ext.create('Spief.model.Speaker', speaker);
//		                speakerStore.add(speakerModel);
//		                sessionSpeakerStore.add(speakerModel);
//
//		                speakerSessions[speaker.id] = speakerSessions[speaker.id] || [];
//		                speakerSessions[speaker.id].push(proposal.id);
//		            });
//
//		            if (proposal.date) {
//		                sessionDays[proposal.date] = {
//		                    day: proposalModel.get('time').getDate(),
//		                    text: Ext.Date.format(proposalModel.get('time'), 'm/d'),
//		                    time: proposalModel.get('time')
//		                };
//		            }
//
//		            sessionStore.add(proposalModel);
//		            speakerSessionStore.add(proposalModel);
//		        });
//
//		        for (speakerId in speakerSessions) {
//		            speaker = speakerStore.findRecord('id', speakerId);
//		            if (speaker) {
//		                speaker.set('sessionIds', speakerSessions[speakerId]);
//		            }
//		        }
//
//		        Spief.sessionDays = Ext.Array.sort(Ext.Object.getValues(sessionDays), function(a, b) {
//		            return a.time < b.time ? -1 : 1;
//		        });
//
//		        callback();
//		    }
//		});

//	}
});
