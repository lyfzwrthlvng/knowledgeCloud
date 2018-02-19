var app = angular.module( 'myApp', [] );
app.controller( 'myCtrl', function( $scope, $http ) {
  $scope.user = {}
  $scope.submitSearch = function() {
  var onSuccess = function (data, status, headers, config) {
      alert('Student saved successfully.');
  };

  var onError = function (data, status, headers, config) {
      alert('Error occured.');
  }

  postdata = {
    uname   : 'dummy',
    ss      : $scope.search_string
  }

  $http.post( '/postdata', postdata )
      .success( onSuccess )
      .error( onError );
};
});
