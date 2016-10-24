/**
 * @class altFuels.factories
 * @memberOf altFuels
 * @author Peter Keller
 */
angular.module('altFuels.factories', [])
  /**
   * @class ServerConnector
   * @memberOf altFuels.factories
   * @description Handle everything related getting and posting to the server. Currently just used for handling one server post request
   */
.factory('ServerConnector', ["$http", "ServerAddress", function($http, ServerAddress) {
  var serverConnector = {

  };
  /**
   * @function setAccess
   * @memberOf altFuels.factories.ServerConnector
   * @param {string} fuelType
   * @param {string} address
   * @param {number} radius
   */
  serverConnector.getExtendedFuelStationsData = function(fuelType, address, radius) {
    var radiusFixed = Number(radius).toFixed(1); //preferred format for nrel
    return $http({
      method: "post",
      url: ServerAddress + "/fuelStationsData",
      data: {
        fuelType: fuelType,
        address: address,
        radius: radiusFixed
      }
    });
  };

  return serverConnector;
}]);
