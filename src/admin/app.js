var parliamentsAdminApp = angular.module('parliamentsAdminApp', ['ngRoute', 'ngResource']);

parliamentsAdminApp.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  // $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

parliamentsAdminApp.controller('CandidatesController', function ($scope, $resource) {
  var Candidates = $resource('/candidates/:candidateId', { candidateId: '@id' });

  $scope.get = function () {
    $scope.candidates = Candidates.query();
  };

  $scope.get();
});


parliamentsAdminApp.controller('ParliamentsController', function ($scope, $resource) {
  var Parliaments = $resource('/parliaments/:parliamentUuid', {parliamentUuid: '@id' });

  $scope.get = function () {
    $scope.parliamentCount = Parliaments.get( { parliamentUuid: 'count' } );
    $scope.parliament = Parliaments.get();
  };

  $scope.get();
});


parliamentsAdminApp.controller('OfficesController', function ($scope, $resource) {
  var Offices = $resource('/offices/:officeId', {officeId: '@id' });

  $scope.get = function () {
    $scope.offices = Offices.query();
  };

  $scope.get();
});