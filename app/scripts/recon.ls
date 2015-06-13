"use strict"
angular.module("app", [
  "ui.router"
  "ngStorage"
  "ngFileUpload"
  "ui.bootstrap"
  "ui.bootstrap.tpls"
  "http-auth-interceptor"
  'cfp.hotkeys'
  'focusOn'
]).config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state "home",
    url: "/"
    templateUrl: "partials/main.html"
    controller: "MainCtrl"
  $stateProvider.state "config",
    url: "/config"
    templateUrl: "partials/config.html"
    controller: "ConfigCtrl"
  $urlRouterProvider.otherwise "/"
.run ($rootScope,$http,authService) !->
  $rootScope.setAuth = !->
    $rootScope.authOpen = false
    $http.defaults.headers.common['Authorization'] = 'Basic '+btoa($rootScope.username+':'+$rootScope.password)
    authService.loginConfirmed!
  $rootScope.dismissAuth = !->
    $rootScope.authOpen = false
    authService.loginCancelled({status:401},"Authentication required")
  $rootScope.$on 'event:auth-loginRequired', !->
    $rootScope.authOpen = true
.directive 'selectOnFocus', ->
    restrict: 'A',
    link: (scope, element, attrs) !->
      element.on 'focus', !-> this.select!

