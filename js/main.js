var app = angular.module( 'myApp', [] );
app.controller( 'myCtrl', function( $scope, $http ) {
  $scope.user = {}
  $scope.submitSearch = function() {
    $http({
      method  : 'POST',
      url     : 'localhost/postdata',
      data    : $score.user,
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success( function( data ) {
      if( data.errors ) {

      } else {
        $scope.message = data.message;
      }
    });
  }
});
