Ext.define('Spief.util.Proxy', {

	singleton: true,

	process: function(url, callback) {

		var sessionStore = Ext.getStore('Sessions'),
		    speakerStore = Ext.getStore('Speakers'),
		    sessionSpeakerStore = Ext.getStore('SessionSpeakers'),
		    speakerSessionStore = Ext.getStore('SpeakerSessions'),
		    sessionIds, proposalModel, speakerModel, speakerSessions = {}, sessionId, speaker, sessionDays = {}, sessionModel;
		
		Ext.data.JsonP.request({
		    url: url,
		    callbackName: 'sessionsCb',

		    success: function(data) {

		        Ext.Array.each(data.sessions, function(session) {

		            session.speakerIds = [];
		            sessionModel = Ext.create('Spief.model.Session', session);

		            Ext.Array.each(session.speakers, function(speaker) {
		                
						session.speakerIds.push(speaker.id);
						
		                speakerModel = Ext.create('Spief.model.Speaker', speaker);
		                speakerStore.add(speakerModel);
		                sessionSpeakerStore.add(speakerModel);

		                speakerSessions[speaker.id] = speakerSessions[speaker.id] || [];
		                speakerSessions[speaker.id].push(session.id);
		            });

		            if (session.startDate) {
						
						var date = sessionModel.get('startDate'),
							stamp = Ext.Date.format(date, 'd M'),
							time = new Date(date.toDateString());
		                
						sessionDays[stamp] = {
		                    day: date.getDate(),
		                    text: stamp,
		                    time: time
		                };
		            }

		            sessionStore.add(sessionModel);
		            speakerSessionStore.add(sessionModel);
		        });

		        for (var speakerId in speakerSessions) {
		            speaker = speakerStore.getById(speakerId);
					if (speaker) {
		                speaker.set('sessionIds', speakerSessions[speakerId]);
		            }
		        }
				
				Spief.sessionDays = Ext.Array.sort(Ext.Object.getValues(sessionDays), function(a, b) {
		            return a.startDate < b.startDate ? -1 : 1;
		        });

		        callback();
		    }
		});

	}
});
