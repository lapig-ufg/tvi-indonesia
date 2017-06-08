var appRoot = require('app-root-path');

module.exports = function(app) {
	//appRoot faz parte da documentação do js
	var config = {
		"appRoot": appRoot, 
		"clientDir": appRoot + "/../client",
		"langDir": appRoot + "/lang",
		"logDir": appRoot + "/log/",
		"redis": {
			"host": "localhost",
			"port": 6379
		},
		"mongo": {
			"host": "localhost",
			"port": "27017",
			"dbname": "tvi"
		},
		"jobs": {
			"timezone": 'America/Sao_Paulo',
			"toRun": [
				{
					"name": "publishLayers",
					"cron": '0 45 12 * * *',
					"runOnAppStart": true,
					"params": {
						"cmd": "python " + appRoot + "/integration/py/publish_layers.py",
						"eeKey": appRoot + "/integration/py/lapig-ee-09144f43f3b5.pem"
					}
				},
				{
					"name": "populateCache",
					"cron": '0 05 13 * * *',
					"runOnAppStart": false,
					"params": {}
				}
			]
		},
		"port": 5000,
	};

	if(process.env.NODE_ENV == 'prod') {
		config["mongo"]["port"] = "27017";
	}

	return config;

}
