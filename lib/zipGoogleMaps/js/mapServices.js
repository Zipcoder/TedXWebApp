maps.factory('mapLocations', ['$http', function($http){
		
		var locationData= {};
		var url= 'lib/zipGoogleMaps/data/mapServices.json';

		$http({
		    method:'GET',
		    url:url
	  	}).then(function successCallback(response){
	  		locationData = response.data;
 	  	});
		
		return {
			all : function(){
				return locationData;
			},
			get : function(id){
				for(var i=0; i< locationData.length; i++){
					if(locationData[i].id === parseInt(id)){
						return locationData[i];
					}
				}
				return null;
			}
		};
	}]);	