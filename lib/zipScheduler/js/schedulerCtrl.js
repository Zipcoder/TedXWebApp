var scheduler = angular.module('tedx.scheduler', []);

scheduler.controller("ScheduleCtrl", function($scope, SchedulerFactory) {
	$scope.events = SchedulerFactory.all;
});
