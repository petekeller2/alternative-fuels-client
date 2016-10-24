angular.module('altFuels', ['ionic', 'altFuels.controllers', 'altFuels.directives', 'altFuels.factories', 'altFuels.config', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('map', {
      url: '/map/{lat}/{long}/{address}/{fuelType}/{hours}/{name}/{phone}',
      views: {
        '': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('list', {
      url: '/list/{radius}/{address}/{fuelType}',
      views: {
        '': {
          templateUrl: 'templates/list.html',
          controller: 'ListCtrl'
        }
      }
    })
    .state('search', {
      url: '/search',
      views: {
        '': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })

  ;
// if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('search');
});
