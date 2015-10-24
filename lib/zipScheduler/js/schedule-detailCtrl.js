scheduler.controller("Schedule-DetailCtrl", function($scope, $stateParams ,SchedulerFactory) {
	$scope.events = SchedulerFactory.getBySession($stateParams.detailId);
	console.log("GHello");
});