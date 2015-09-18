module app {

  interface IAuthenticationRootScopeService extends angular.IRootScopeService {
    setAuth : () => void
    dismissAuth : () => void
    authInfo : {
      authOpen : boolean
      username: string
      password : string
    }
  }

  var m = angular.module("app", [ "ui.router", "ngStorage", "ngFileUpload", "ui.bootstrap", "ui.bootstrap.tpls", "ab-base64", "http-auth-interceptor", "cfp.hotkeys", "focusOn" ])
  m.config(($stateProvider : angular.ui.IStateProvider,$urlRouterProvider : angular.ui.IUrlRouterProvider) => {
    $urlRouterProvider.otherwise('/')
    $stateProvider.state('projectlist', {
      url: '/',
      templateUrl: 'partials/projectlist.html',
      controller: 'ProjectListController'
    })
    $stateProvider.state('project', {
      url: '/:projectId/',
      templateUrl: 'partials/project.html',
      controller: 'ProjectController'
    })
    $stateProvider.state('configure',{
      url : '/:projectId/configure',
      templateUrl: 'partials/configure.html',
      controller : 'ConfigureController'
    })
  })
  m.run(($rootScope : IAuthenticationRootScopeService, $http : angular.IHttpService, authService : angular.httpAuth.IAuthService) => {
    $rootScope.authInfo = {
      authOpen:false,
      username:undefined,
      password:undefined
    }
    $rootScope.setAuth = () => {
      $rootScope.authInfo.authOpen = false
      $http.defaults.headers.common['Authorization'] = 'Basic '+btoa($rootScope.authInfo.username+':'+$rootScope.authInfo.password)
      authService.loginConfirmed()
    }
    $rootScope.dismissAuth = () => {
      $rootScope.authInfo.authOpen = false
      authService.loginCancelled({status:401},"Authentication required")
    }
    $rootScope.$on('event:auth-loginRequired',() => $rootScope.authInfo.authOpen=true)
  })

  export class SelectOnClickDirective {
    restrict = 'A'
    constructor() {}
    link = (scope: angular.IScope, element: JQuery, attr: angular.IAttributes) => {
      element.on('click',function (event:JQueryEventObject) {this.select();event.stopPropagation();})
    }
  }
}
