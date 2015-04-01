"use strict"
angular.module("app", [
  "ui.router"
  "ngStorage"
]).config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state "home",
    url: "/?sparqlEndpoint&query"
    templateUrl: "partials/main.html"
    controller: "MainCtrl"
  $urlRouterProvider.otherwise "/"
