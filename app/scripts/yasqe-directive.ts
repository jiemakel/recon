module app {

  interface IYASQEScope extends angular.IScope {
    data : string
  }

  declare var YASQE

  export class YasqeDirective {
    constructor(private $timeout:angular.ITimeoutService) {}
    restrict = 'E'
    scope = {
      data : "=data",
      endpoint : "=endpoint"
    }
    link = ($scope: IYASQEScope, element: JQuery, attr: angular.IAttributes) => {
      var yasqe = YASQE(element[0],{createShareLink:false,sparql:{showQueryButton:false}})
      yasqe.on("change", () => this.$timeout(() => $scope.data=yasqe.getValue()))
      $scope.$watch('data',(data:string,odata:string) => { if (data && data!=yasqe.getValue()) yasqe.setValue(data) })
      $scope.$watch('endpoint',(endpoint:string) => { if (endpoint) yasqe.options.sparql.endpoint=endpoint })
    }
  }
}
