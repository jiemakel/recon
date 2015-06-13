angular.module('app').directive 'yasqe', ($timeout) ->
  {
    restrict: 'E'
    scope:
      data : "=data"
      endpoint : "=endpoint"
    link: ($scope,elem,attrs) !->
      yasqe = YASQE(elem[0],
        createShareLink: false
        sparql:
          showQueryButton: false
      )
      yasqe.on("change", !-> $timeout(!-> $scope.data=yasqe.getValue!))
      $scope.$watch 'data',(data,odata) !-> if (data && data!=yasqe.getValue!) then yasqe.setValue(data)
      $scope.$watch 'endpoint',(endpoint) !-> if (endpoint) then yasqe.options.sparql.endpoint=endpoint
  }
