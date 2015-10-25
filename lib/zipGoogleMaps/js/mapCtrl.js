var maps = angular.module('tedx.maps', []);


maps.controller('MapController', function($scope, mapLocations) {
  var conferenceMarkers = new Array();
  var conferenceWindows = new Array();

  var parkingMarkers = new Array();
  var parkingWindows = new Array();

  var restaurantMarkers = new Array();
  var restaurantWindows = new Array();
  
  $scope.locations = mapLocations.all();

  // declare map used in both setMarkers and initializeMap
  var map;

  /**
   *  Set markers on the map
   * 
   * Set markers on the map based on the contents of the current locations object
   */
  function setMarkers() {
    for(key in $scope.locations){
      for(parking in $scope.locations[key].parking){
        parkingMarkers[parking] = new google.maps.Marker({
          position: new google.maps.LatLng($scope.locations[key].parking[parking].latitude, $scope.locations[key].parking[parking].longitude),
          map: map,
          title: $scope.locations[key].parking[parking].name,
          icon: "https://maps.gstatic.com/mapfiles/ms2/micons/parkinglot.png"
        });
        parkingMarkers[parking].index = parking;

        parkingWindows[parking] = new google.maps.InfoWindow({
          content: '<h4>'+ $scope.locations[key].parking[parking].name+ '</h4><p>'+ $scope.locations[key].parking[parking].description+'</p><a href="https://www.google.com/maps/dir/Current+Location/' + $scope.locations[key].parking[parking].address +'">Get Directions</a>',
          maxWidth: 300
        });

        google.maps.event.addListener(parkingMarkers[parking], 'click', function() {
          parkingWindows[this.index].open(map,parkingMarkers[this.index]);
          map.panTo(parkingMarkers[this.index].getPosition());
      });  
  
      }

      for(conference in $scope.locations[key].conference){
        conferenceMarkers[conference] = new google.maps.Marker({
          position: new google.maps.LatLng($scope.locations[key].conference[conference].latitude, $scope.locations[key].conference[conference].longitude),
          map: map,
          title: $scope.locations[key].conference[conference].name
        });
        conferenceMarkers[conference].index = conference;

        conferenceWindows[conference] = new google.maps.InfoWindow({
          content: '<h4>'+ $scope.locations[key].conference[conference].name+ '</h4><p>'+ $scope.locations[key].conference[conference].description+'</p><a href="https://www.google.com/maps/dir/Current+Location/' + $scope.locations[key].conference[conference].address +'">Get Directions</a>',
          maxWidth: 300
        });

        google.maps.event.addListener(conferenceMarkers[conference], 'click', function() {
          conferenceWindows[this.index].open(map,conferenceMarkers[this.index]);
          map.panTo(conferenceMarkers[this.index].getPosition());
        });  


        
      }

      for(restaurant in $scope.locations[key].restaurant){
        restaurantMarkers[restaurant] = new google.maps.Marker({
          position: new google.maps.LatLng($scope.locations[key].restaurant[restaurant].latitude, $scope.locations[key].restaurant[restaurant].longitude),
          map: map,
          title: $scope.locations[key].restaurant[restaurant].name,
          icon: "https://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png"
        });
        restaurantMarkers[restaurant].index = restaurant;

        restaurantWindows[restaurant] = new google.maps.InfoWindow({
          content: '<h4>'+ $scope.locations[key].restaurant[restaurant].name+ '</h4><p>'+ $scope.locations[key].restaurant[restaurant].description+'</p><a href="https://www.google.com/maps/dir/Current+Location/' + $scope.locations[key].restaurant[restaurant].address +'">Get Directions</a>',
          maxWidth: 300
        });

        google.maps.event.addListener(restaurantMarkers[restaurant], 'click', function() {
          restaurantWindows[this.index].open(map,restaurantMarkers[this.index]);
          map.panTo(restaurantMarkers[this.index].getPosition());
        }); 

      }
    }      
  }

  /*
   *  Initialize the map in the div with id map
   */
  function initializeMap(){
    var mapOptions = {
        center: new google.maps.LatLng(39.741126, -75.550277),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  // Initialize the map
  initializeMap();

  // Watch for changes to mapLocations (should only be triggered once)
  $scope.$watch(function() {
    return mapLocations.all();
  },function(newVal, oldVal) {
    $scope.locations = newVal;
    if(typeof map !== "undefined") {
      setMarkers();
    }
  })
})
.directive("ngGoogleMap",function() {
  return {
    restrict: 'EA',
    scope: false,
    template: '<div id="map"></div>',
    controller: 'MapController'
  };
})

