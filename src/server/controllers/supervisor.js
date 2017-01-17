var ejs = require('ejs');
var fs = require('fs')
var schedule = require('node-schedule');

module.exports = function(app) {

	var Points = {};
	var pointsCollection = app.repository.collections.points;


	Points.getPoint = function(request, response){
		var user = request.session.user;
		pointsCollection.findOne({"campaign": user.campaign}, function(err, document){
			response.send(document)
			response.end();
		});

	}

	Points.getPointWithParam = function(request, response){
		
		var campaign = request.session.user.campaign
		var index = parseInt(request.params.index);
		pointsCollection.findOne({ $and: [ { "index": index }, { "campaign": campaign } ] }, function(err, obj){			
			console.log(obj)
			response.send(obj)
			response.end();
		});


	}

	return Points;

};