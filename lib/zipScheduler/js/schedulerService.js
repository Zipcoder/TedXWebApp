scheduler.factory("SchedulerFactory", function() {
	var events =[
		{
			"eventName": "Registration/Check-in", 
			"eventTime": "7:30 am",
			"sessionId": 0
		},

		{
			"eventName": "Session I", 
			"eventTime": "8:00 am",
			"sessionId": 1

		},

		{
			"eventName": "Break",
			"eventTime": "9:30 am",
			"sessionId": 0
		},

		{
			"eventName": "Session II",
			"eventTime": "10:30 am",
			"sessionId": 2

		},

		{
			"eventName": "Lunch Break",
			"eventTime": "12:00 pm",
			"sessionId": 0
		},

		{
			"eventName": "Session III", 
			"eventTime": "1:00 pm",
			"sessionId": 3
		},

		{
			"eventName": "Break", 
			"eventTime": "2:30 pm",
			"sessionId": 0
		},

		{
			"eventName": "Session IV", 
			"eventTime": "3:15 pm",
			"sessionId": 4

		},

		{
			"eventName": "End", 
			"eventTime": "5:00 pm",
			"sessionId": 0
		}
	];
	return {
		all:events,
		getBySession: function(sessionId) {
			var session =  new Array();
			for(e in events) {
				if(events[e].sessionId == sessionId){
					session.push(events[e]);
				}
			}
			return session;

		}
	}
});