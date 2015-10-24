scheduler.controller("Schedule-ProfileCtrl", function($scope, $stateParams ,SchedulerFactory) {
	$scope.profile = SchedulerFactory.getByLastName($stateParams.id);
});