module.exports = function (app) {

	var dashboard = app.controllers.dashboard;

	app.get('/service/points/count/', dashboard.donuts);
	app.get('/service/points/horizontal1/', dashboard.horizontalBar1)

}