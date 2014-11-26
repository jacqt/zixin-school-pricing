var serverResources = angular.module('serverResources', ['ngResource']);

serverResources.factory('FeeData', ['$resource',
  function($resource){
    return $resource('resources/:ObjectName.json', {}, {
      //query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
      query: {method:'GET', params:{ObjectName:'FeeData'}, isArray:true}
    });
  }]);
