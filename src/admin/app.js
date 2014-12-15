var parliamentsAdminApp = angular.module('parliamentsAdminApp', ['ngRoute', 'ngResource']);

parliamentsAdminApp.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  // $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

parliamentsAdminApp.controller('CandidatesController', function ($scope, $resource) {

  var Candidates = $resource('/candidates/:candidateId', { candidateId: '@id' });
  $scope.candidates = Candidates.query();

  $scope.hideCandidate = function (candidate_id, index) {
    Candidates.delete( { candidateId: candidate_id }, function () {
      //$scope.candidates
    });
  };
});


parliamentsAdminApp.controller('ParliamentsController', function ($scope, $resource) {

  var Parliaments = $resource('/parliaments/:parliamentUuid', {parliamentUuid: '@id' });
  $scope.parliament = Parliaments.get();
  $scope.parliamentCount = Parliaments.get( { parliamentUuid: 'count' } );
});


parliamentsAdminApp.controller('OfficesController', function ($scope, $resource) {

  var Offices = $resource('/offices/:officeId', {officeId: '@id' });
  $scope.offices = Offices.query();

  $scope.send = function (index) {
    $scope.offices[index].$save({officeId:$scope.offices[index].office.id});
  };
});