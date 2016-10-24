/**
 * @class altFuels.controllers
 * @memberOf altFuels
 * @author Peter Keller
 */
angular.module('altFuels.controllers', [])
/**
 * @class MapCtrl
 * @memberOf altFuels.controllers
 * @description The code for handling native navigation is not here, it is in the navigation plugin
 */
.controller('MapCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', function($scope, $stateParams, $ionicPopup, $state) {
  /**
   * @function mapCreated
   * @memberOf altFuels.controllers.MapCtrl
   * @param {object} map
   * @description Creates the map and sets the marker
   */
  $scope.mapCreated = function(map) {
    if($stateParams.lat && $stateParams.long) {

    }
    else {
      var longLatPopup = $ionicPopup.alert({
        title: 'Longitude or latitude is missing!'
      });

      longLatPopup.then(function(res) {
        $state.go('list');
      });
    }
    $scope.map = map;
    $scope.map.setCenter(new google.maps.LatLng($stateParams.lat, $stateParams.long));

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var latLng = new google.maps.LatLng($stateParams.lat, $stateParams.long);

      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var content;
      if($stateParams.address) {
        content = $stateParams.address;
      }
      if($stateParams.fuelType) {
        content = content + '<br>' + $stateParams.fuelType;
      }
      if($stateParams.hours) {
        content = content + '<br>' + $stateParams.hours;
      }
      if($stateParams.name) {
        content = content + '<br>' + $stateParams.name;
      }
      if($stateParams.phone) {
        content = content + '<br>' + $stateParams.phone;
      }

      if(content) {

      }
      else {
        content = "Longitude: " + $stateParams.long + "<br> Latitude: " + $stateParams.lat;
      }

      var infoWindow = new google.maps.InfoWindow({
        content: content
      });

      infoWindow.open($scope.map, marker);

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });

    });
  };

  /**
   * @function showOnMap
   * @memberOf altFuels.controllers.MapCtrl
   * @description Centers the map on the original latitude and longitude coordinates
   */
  $scope.showOnMap = function () {
    //console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.map.setCenter(new google.maps.LatLng($stateParams.lat, $stateParams.long));
  };
}])
/**
 * @class ListCtrl
 * @memberOf altFuels.controllers
 * @param {string} usingWebsite - UsingWebsite constant value on the $scope
 * @param {string} sortBy
 * @param {object} fuelData
 */
.controller('ListCtrl', ['$scope', '$state', '$cordovaLaunchNavigator', 'ServerConnector', '$stateParams', 'UsingWebsite', '$ionicPopup', function($scope, $state, $cordovaLaunchNavigator, ServerConnector, $stateParams, UsingWebsite, $ionicPopup) {

  $scope.$on('$ionicView.enter', function() {
    //console.log("$stateParams", $stateParams);
    if($stateParams.radius && $stateParams.address && $stateParams.fuelType) {

    }
    else {
      var allFieldsPopup = $ionicPopup.alert({
        title: 'All fields are required!'
      });

      allFieldsPopup.then(function(res) {
        $state.go('search');
      });
    }
  });

  /**
   * @function goToMap
   * @memberOf altFuels.controllers.ListCtrl
   * @param {number} long
   * @param {number} lat
   * @param {string} address
   * @param {string} fuelType
   * @param {string} hours
   * @param {string} name
   * @param {string} phone
   */
  $scope.goToMap = function(long, lat, address, fuelType, hours, name, phone) {
    if(long && lat) {
      var fullFuelType;
      switch (fuelType) {
        case "BD":
          fullFuelType = "Biodiesel (B20 and above)";
          break;
        case "CNG":
          fullFuelType = "Compressed Natural Gas";
          break;
        case "E85":
          fullFuelType = "Ethanol (E85)";
          break;
        case "ELEC":
          fullFuelType = "Electric";
          break;
        case "HY":
          fullFuelType = "Hydrogen";
          break;
        case "LNG":
          fullFuelType = "Liquefied Natural Gas";
          break;
        case "LPG":
          fullFuelType = "Liquefied Petroleum Gas (Propane)";
          break;
        default:
          fullFuelType = "";
      }
      $state.go('map', {long: long, lat: lat, address: address, fuelType: fullFuelType, hours: hours, name: name, phone: phone});
    }
    else {
      var longLatMissingPopup = $ionicPopup.alert({
        title: 'Longitude and/or latitude is missing!'
      });

      longLatMissingPopup.then(function(res) {
        $state.go('list');
      });
    }
  };

  $scope.usingWebsite = UsingWebsite;

  /**
   * @function launchNavigator
   * @memberOf altFuels.controllers.ListCtrl
   * @param {string} destination
   * @description For native apps only
   */
  $scope.launchNavigator = function(destination) {
    $cordovaLaunchNavigator.navigate(destination, $stateParams.address).then(function() {
      //console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };

  /**
   * @function getFuelData
   * @memberOf altFuels.controllers.ListCtrl
   * @param {string} fuelType
   * @param {string} address
   * @param {number} radius - should not go over 500
   */
  $scope.getFuelData = function(fuelType, address, radius) {

    var fuelData = ServerConnector.getExtendedFuelStationsData(fuelType, address, radius);

    fuelData.then(function (fuelDataResponse) {
      //console.log("fuelDataResponse", fuelDataResponse);
      if(fuelDataResponse) {
        if(fuelDataResponse.data === 'address, radius and fuel type required!' || fuelDataResponse.data === 'error' || fuelDataResponse.data === 'no results' || fuelDataResponse.data === 'distance and duration calculation failed') {
          var reportErrorPopup = $ionicPopup.alert({
            title: fuelDataResponse.data
          });

          reportErrorPopup.then(function(res) {
            $state.go('search');
          });
        }
        else if(fuelDataResponse.status!=200) {
          var statusErrorPopup = $ionicPopup.alert({
            title: "http error: " + fuelDataResponse.status
          });

          statusErrorPopup.then(function(res) {
            $state.go('search');
          });
        }
        else {
          $scope.fuelData = fuelDataResponse.data;
        }
      }
    });
  };

  //on page load
  $scope.sortBy = 'totalDistance';
  if($scope.fuelData) {

  }
  else {
    //console.log("$scope.fuelData is empty", $scope.fuelData);
    if ($stateParams.radius && $stateParams.address && $stateParams.fuelType) {
      $scope.getFuelData($stateParams.fuelType, $stateParams.address, $stateParams.radius);
    }
    else {
      $state.go('search');
    }
  }



}])
/**
 * @class SearchCtrl
 * @memberOf altFuels.controllers
 * @param {object} inputs
 */
.controller('SearchCtrl', ['$scope', '$state', '$ionicPopup', function($scope, $state, $ionicPopup) {
  if($scope.inputs) {

  }
  else {
    $scope.inputs = {
      radius: 250,
      address: null,
      fuelType: 'all'
    };
  }

  /**
   * @function fuelSearch
   * @memberOf altFuels.controllers.SearchCtrl
   */
  $scope.fuelSearch = function() {
    if($scope.inputs && $scope.inputs.radius && $scope.inputs.address && $scope.inputs.fuelType) {
      $state.go('list', {radius: $scope.inputs.radius, address: $scope.inputs.address, fuelType: $scope.inputs.fuelType});
    }
    else {
      var missingSearchInputsPopup = $ionicPopup.alert({
        title: 'Fill out all the fields!'
      });

      missingSearchInputsPopup.then(function(res) {

      });
    }
  };
}])

;
