var youtube = angular.module('tedx.youtube', []);

youtube.controller('YoutubeCtrl', ['$scope','youtubeApi', '$ionicSideMenuDelegate',function($scope, youtubeApi, $ionicSideMenuDelegate){
	  $scope.playlists = youtubeApi.getPlaylists();
	  $scope.videos = youtubeApi.getVideos();
	  $scope.search = "";
	  $scope.playingId = "";

	  // watch videos
	  $scope.$watchCollection(function() {
	  		return youtubeApi.getVideos();
	  }, function(newVal, oldVal) {
	  		$scope.videos = newVal;
	  })

	  // watch playlists
	  $scope.$watchCollection(function() {
	  		return youtubeApi.getPlaylists();
	  }, function(newVal, oldVal) {
	  		$scope.playlists = newVal;
	  })

	  $scope.selectPlaylist = function(playlist) {
	      if(typeof playlist === "undefined") {
	          $scope.videos = youtubeApi.getVideos();
	      }
	      else {
	          $scope.videos = playlist.items;
	      }
	  };

	  $scope.searchTedx = function(search) {
	      youtubeApi.search(search);
	      $scope.videos = youtubeApi.getLastSearch();
	  };

	  $scope.play = function(video) {
	    var path = video.embedUrl;
		window.open(path, '_system');	  
	  }

	  $scope.openSideMenu = function() {
	  	$ionicSideMenuDelegate.toggleRight();
	  }
}]);