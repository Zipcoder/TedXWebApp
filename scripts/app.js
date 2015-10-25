"use strict";

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'tedx.scheduler', 'tedx.maps', 'tedx.youtube'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }*/
  });
})

.config(function($stateProvider, $urlRouterProvider) {
// Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('core', {
    url: '/core',
    abstract: true,
    templateUrl: 'lib/zipCore/templates/main.html'
  })

  // Each tab has its own nav history stack:

  .state('core.main', {
    url: '/schedule',
    views: {
      'schedule-main': {
        templateUrl: 'lib/zipScheduler/templates/schedule-main.html',
        controller: 'ScheduleCtrl'
      }
    }
  })

  .state('core.detail', {
    url: '/schedule/:detailId',
    views: {
      'schedule-main': {
        templateUrl: 'lib/zipScheduler/templates/schedule-detail.html',
        controller: 'Schedule-DetailCtrl'
      }
    }

  })

  .state('core.profile', {
    url: '/schedule/profile/:id',
    views: {
      'schedule-main': {
        templateUrl: 'lib/zipScheduler/templates/schedule-profile.html',
        controller: 'Schedule-ProfileCtrl'
      }
    }

  })

  .state('core.map', {
    url: '/map',
    views: {
      'map': {
        templateUrl: 'lib/zipGoogleMaps/templates/map.html'
        }
    }

  })

  .state('core.youtube', {
    url: '/youtube',
    views: {
      'tab-youtube': {
        templateUrl: 'lib/zipYoutube/templates/youtubePlayer.html',
        controller: 'YoutubeCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/core/schedule');
});
