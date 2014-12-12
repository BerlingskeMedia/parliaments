var parliamentsAdminApp = angular.module('parliamentsAdminApp', ['ngRoute', 'ngResource']);

parliamentsAdminApp.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  // $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

parliamentsAdminApp.controller('CandidatesController', function ($scope, $resource) {
  $scope.showSection = false;

  var Candidates = $resource('/candidates/:candidateId', { candidateId: '@id' });
  $scope.candidates = Candidates.query();

  $scope.deleteCandidate = function (candidate_id, index) {
    Candidates.delete( { candidateId: candidate_id }, function () {
      // $scope.candidates.splice(index, index + 1);
    });
  };
});


parliamentsAdminApp.controller('ParliamentsController', function ($scope, $resource) {

  $scope.showSection = false;

  var Parliaments = $resource('/parliaments/:parliamentUuid', {parliamentUuid: '@id' });
  $scope.parliaments = Parliaments.query( { parliamentUuid: 'all' } );

  $scope.showParliament = function (parliament_uuid) {

  };

  $scope.deleteParliament = function (parliament_uuid, index) {
    Parliaments.delete( { parliamentUuid: parliament_uuid }, function () {
      // $scope.parliaments.splice(index, index + 1);
    });
  };
});


parliamentsAdminApp.controller('OfficesController', function ($scope, $resource) {

  var Offices = $resource('/offices/:officeId', {officeId: '@id' });
  $scope.offices = Offices.query();
  console.log($scope.offices);
  $scope.showSection = false;

  $scope.send = function (id, sort) {
    console.log('SEND', id, sort);
  };
});