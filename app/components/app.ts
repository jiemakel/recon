namespace fi.seco.recon {
  'use strict'

  interface IAuthenticationRootScopeService extends angular.IRootScopeService {
    setAuth: () => void
    dismissAuth: () => void
    authInfo: {
      authOpen: boolean
      username: string
      password: string
    }
  }

  let m: ng.IModule = angular.module('app', [ 'ui.router', 'ngStorage', 'ngFileUpload', 'ui.bootstrap', 'ui.bootstrap.tpls', 'ab-base64', 'http-auth-interceptor', 'cfp.hotkeys', 'focusOn', 'fi.seco.sparql', 'fi.seco.yasqe' ])
  m.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
    $urlRouterProvider.otherwise('/')
    $stateProvider.state('projectlist', {
      url: '/',
      templateUrl: 'components/projectlist.html',
      controller: 'ProjectListController'
    })
    $stateProvider.state('project', {
      url: '/:projectId/',
      templateUrl: 'components/project.html',
      controller: 'ProjectController'
    })
    $stateProvider.state('configure', {
      url: '/:projectId/configure?configURL',
      templateUrl: 'components/configure.html',
      controller: 'ConfigureController'
    })
  })
  m.config(($localStorageProvider) => {
    $localStorageProvider.setKeyPrefix('recon-');
  })
  m.run(($rootScope: IAuthenticationRootScopeService, $http: angular.IHttpService, authService: angular.httpAuth.IAuthService) => {
    $rootScope.authInfo = {
      authOpen: false,
      username: undefined,
      password: undefined
    }
    $rootScope.setAuth = () => {
      $rootScope.authInfo.authOpen = false
      $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.authInfo.username + ':' + $rootScope.authInfo.password)
      authService.loginConfirmed()
    }
    $rootScope.dismissAuth = () => {
      $rootScope.authInfo.authOpen = false
      authService.loginCancelled({status: 401}, 'Authentication required')
    }
    $rootScope.$on('event:auth-loginRequired', () => $rootScope.authInfo.authOpen = true)
  })
  m.filter('trustAsHtml', ['$sce', function($sce: angular.ISCEService): (htmlCode: string) => any {
    return function(htmlCode: string): any {
      return $sce.trustAsHtml(htmlCode)
    }
  }])

  export class SelectOnFocusDirective {
    public restrict: string = 'A'
    public link: (...any) => void = (scope: angular.IScope, element: JQuery, attr: angular.IAttributes) => {
      element.on('mouseup', function (event: JQueryEventObject): void { event.preventDefault(); })
      element.on('focus', function (event: JQueryEventObject): void { this.select(); })
    }
  }
}
