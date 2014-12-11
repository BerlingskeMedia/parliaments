var parliamentsAdminApp = angular.module('parliamentsAdminApp', ['ngRoute', 'ngResource']);

parliamentsAdminApp.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  // $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

parliamentsAdminApp.controller('CandidatesController', function ($scope, $resource) {

  var Candidates = $resource('/candidates/:candidateId', { candidateId: '@id' });

  $scope.candidates = Candidates.query();

  $scope.showCandidates = false;
  $scope.show = function (value) {
    $scope.showCandidates = value !== undefined ? value : true;
  };

  $scope.delete = function (candidate_id, index) {
    Candidates.delete( { candidateId: candidate_id }, function (data, headers) {
      $scope.candidates.splice(index, index + 1);
    });
  };
});


parliamentsAdminApp.controller('ParliamentsController', function ($scope, $resource) {

  var Parliaments = $resource('/parliaments/:parliamentUuid', {parliamentUuid: '@id' });

  $scope.parliaments = Parliaments.query( { parliamentUuid: 'all' } );

  $scope.showParliaments = false;
  $scope.show = function (value) {
    $scope.showParliaments = value !== undefined ? value : true;
  };

  $scope.delete = function (parliament_uuid, index) {
    Parliaments.delete( { parliamentUuid: parliament_uuid }, function (data, headers) {
      $scope.parliaments.splice(index, index + 1);
    });
  };
});