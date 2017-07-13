var Application = angular.module('application', ['ngRoute', 'ngMagnify']);

Application.config(function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/temporal', {
			controller: 'temporalController',
			templateUrl: 'views/temporal.tpl.html',
			reloadOnSearch: false
		})
		.when('/supervisor', {
			controller: 'supervisorController',
			templateUrl: 'views/supervisor.tpl.html',
			reloadOnSearch: false
		})
		.when('/dashboard', {
			controller: 'dashboardController',
			templateUrl: 'views/dashboard.tpl.html',
			reloadOnSearch: false
		})
		.otherwise({
			redirectTo: '/login',
			controller: 'LoginController',
			templateUrl:'views/login.tpl.html'
		});

}).run(function($http) {
	
	var socket = io.connect('/', {
		transports: [ 'websocket' ]
	});

	$http.defaults.headers.post['Content-Type'] = 'application/json';
	$http.defaults.headers.put['Content-Type'] = 'application/json';
	delete $http.defaults.headers.common['X-Requested-With'];

});