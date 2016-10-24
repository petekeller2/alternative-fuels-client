/**
 * @class altFuels.config
 * @memberOf altFuels
 * @author Peter Keller
 * @description check schedule of worker
 */
angular.module('altFuels.config', [])

/**
 * @function ServerAddress
 * @memberOf altFuels.config
 * @description Set this to localhost for connecting to a local server
 */
.constant('ServerAddress', 'https://alternative-fuels.herokuapp.com')
/**
 * @function UsingWebsite
 * @memberOf altFuels.config
 * @description Set to false in the merges folder copy of this file
 */
.constant('UsingWebsite', true);
