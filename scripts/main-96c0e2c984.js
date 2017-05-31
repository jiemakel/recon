var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=angular.module("app",["ui.router","ngStorage","ngFileUpload","ui.bootstrap","ui.bootstrap.tpls","ab-base64","http-auth-interceptor","cfp.hotkeys","focusOn","fi.seco.sparql","fi.seco.yasqe"]);e.config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/"),t.state("projectlist",{url:"/",templateUrl:"components/projectlist.html",controller:"ProjectListController"}),t.state("project",{url:"/:projectId/",templateUrl:"components/project.html",controller:"ProjectController"}),t.state("configure",{url:"/:projectId/configure?configURL",templateUrl:"components/configure.html",controller:"ConfigureController"})}]),e.config(["$localStorageProvider",function(t){t.setKeyPrefix("recon-")}]),e.run(["$rootScope","$http","authService",function(t,e,n){t.authInfo={authOpen:!1,username:void 0,password:void 0},t.setAuth=function(){t.authInfo.authOpen=!1,e.defaults.headers.common.Authorization="Basic "+btoa(t.authInfo.username+":"+t.authInfo.password),n.loginConfirmed()},t.dismissAuth=function(){t.authInfo.authOpen=!1,n.loginCancelled({status:401},"Authentication required")},t.$on("event:auth-loginRequired",function(){return t.authInfo.authOpen=!0})}]),e.filter("trustAsHtml",["$sce",function(t){return function(e){return t.trustAsHtml(e)}}]);var n=function(){function t(){this.restrict="A",this.link=function(t,e,n){e.on("mouseup",function(t){t.preventDefault()}),e.on("focus",function(t){this.select()})}}return t}();angular.module("app").directive("selectOnFocus",[function(){return new(Function.prototype.bind.apply(n,[null].concat(Array.prototype.slice.apply(arguments))))}]),t.SelectOnFocusDirective=n}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(e){var n;!function(e){"use strict";var n=t.seco.sparql,r=function(){function t(t){this.name=t,this.data=[],this.active=!1}return t}(),a=function(){function t(t,e,a,o,c,s,i,l,u,d,p){var f=this;t.projectId=o.projectId,e.projects||(e.projects={}),e.projects[o.projectId]||(e.projects[o.projectId]={config:null,state:null});var h=e.projects[o.projectId].config;if(!h)return void a.go("configure",{projectId:o.projectId});t.config=h,e.projects[o.projectId].state||(e.projects[o.projectId].state={currentRow:0,currentOffset:0,reconData:[],data:[],sparqlEndpoint:void 0,loadQuery:void 0,fileName:void 0,counts:{match:0,nomatch:0},headings:[],descriptionHeadings:[],additionalDescriptionHeadings:[]});var g=e.projects[o.projectId].state;h.loadQuery&&!g.loadQuery&&(g.loadQuery=h.loadQuery,h.loadSparqlEndpoint?g.sparqlEndpoint=h.loadSparqlEndpoint:g.sparqlEndpoint=h.sparqlEndpoint),t.state=g,t.currentPage=g.currentOffset/h.pageSize+1,i.bindTo(t).add({combo:"shift+tab",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){g.currentRow===g.currentOffset&&(t.currentPage--,0===t.currentPage&&(t.currentPage=Math.floor(g.data.length/h.pageSize+1)))}}),i.bindTo(t).add({combo:"tab",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){g.currentRow!==g.currentOffset+h.pageSize-1&&g.currentRow!==g.data.length-1||(t.currentPage++,(t.currentPage-1)*h.pageSize>g.data.length&&(t.currentPage=1))}}),i.bindTo(t).add({combo:"ctrl+0",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){g.reconData[g.currentRow]||(g.reconData[g.currentRow]={matches:void 0,notes:"",candidates:[]}),g.reconData[g.currentRow].matches&&g.counts.match--,g.counts.nomatch++,g.reconData[g.currentRow].matches=null,g.currentRow===g.currentOffset+h.pageSize-1?(t.currentPage++,(t.currentPage-1)*h.pageSize>g.data.length&&(t.currentPage=1)):d("row"+(g.currentRow+1)),e.preventDefault()}});for(var m=1;m<10;m++)i.bindTo(t).add({combo:"ctrl+"+m,allowIn:["INPUT","TEXTAREA"],callback:function(e,n){var r=g.reconData[g.currentRow].candidates[parseInt(n.combo[0].substr(5),10)-1];g.reconData[g.currentRow].matches||(r&&g.counts.match++,null===g.reconData[g.currentRow].matches&&g.counts.nomatch--),g.reconData[g.currentRow].matches=[],r?g.reconData[g.currentRow].matches.push(r):g.reconData[g.currentRow].matches=void 0,g.currentRow===g.currentOffset+h.pageSize-1?(t.currentPage++,(t.currentPage-1)*h.pageSize>g.data.length&&(t.currentPage=1)):d("row"+(g.currentRow+1)),e.preventDefault()}});for(var m=1;m<10;m++)i.bindTo(t).add({combo:"ctrl+shift+"+m,allowIn:["INPUT","TEXTAREA"],callback:function(t,e){var n=g.reconData[g.currentRow].candidates[parseInt(e.combo[0].substr(11),10)-1];g.reconData[g.currentRow].matches||(n&&g.counts.match++,null===g.reconData[g.currentRow].matches&&g.counts.nomatch--,g.reconData[g.currentRow].matches=[]),n&&(g.reconData[g.currentRow].matches.filter(function(t){return t.id===n.id}).length>0?(g.reconData[g.currentRow].matches=g.reconData[g.currentRow].matches.filter(function(t){return t.id!==n.id}),0==g.reconData[g.currentRow].matches.length&&(g.counts.match--,g.reconData[g.currentRow].matches=void 0)):g.reconData[g.currentRow].matches.push(n)),t.preventDefault()}});var b=function(e){return t.error=e},v=!1,w=function(e){if(e=e.filter(function(t){return""!==t.text}),0!==e.length){var r=h.matchQuery.split(/[\{\}] # \/?QUERY/),a=r[0];e.forEach(function(t){var e=r[1].replace(/<QUERY_ID>/g,""+t.index).replace(/<QUERY>/g,n.SparqlService.stringToSPARQLString(t.text));g.data[t.index].forEach(function(t,r){null!==t&&void 0!==t&&(e=e.replace(new RegExp("<CELL_"+r+">","g"),n.SparqlService.stringToSPARQLString(t)))}),a+="{"+e+"} UNION"}),a=a.substring(0,a.length-6)+r[2],f.canceler.resolve(),t.queryRunning=!0,f.canceler=c.defer(),s.query(h.sparqlEndpoint,a,{timeout:f.canceler.promise}).then(function(n){e.length>1&&(v=!1),e.forEach(function(t){g.reconData[t.index]&&delete g.reconData[t.index].candidates}),t.error=void 0,t.queryRunning=!1,g.descriptionHeadings=[],g.additionalDescriptionHeadings=[],n.data.head.vars.filter(function(t){return"queryId"!==t&&"entity"!==t&&"label"!==t&&"score"!==t}).forEach(function(t){0===t.indexOf("_")?g.additionalDescriptionHeadings.push(t.substr(1)):g.descriptionHeadings.push(t)});var r={};n.data.results.bindings.filter(function(t){return!!t.entity}).forEach(function(t,e){r[t.queryId.value]||(r[t.queryId.value]={});var n=r[t.queryId.value],a=Math.floor(127+127*parseFloat(t.score.value));n[t.entity.value]||(n[t.entity.value]={index:e,id:t.entity.value,label:t.label.value,color:"rgb("+a+","+a+","+a+")",description:[],additionalDescription:[]}),g.descriptionHeadings.forEach(function(e){return n[t.entity.value].description.push(t[e]?t[e].value:"")}),g.additionalDescriptionHeadings.forEach(function(e){return n[t.entity.value].additionalDescription.push(t["_"+e]?t["_"+e].value:"")})});for(var a in r){g.reconData[a]||(g.reconData[a]={matches:void 0,notes:"",candidates:[]});var o=[];for(var c in r[a])o.push(r[a][c]);o.sort(function(t,e){return t.index-e.index}),g.reconData[a].candidates=o}},function(t){e.length>1?(v=!0,w([{text:g.data[g.currentRow][0],index:g.currentRow}])):b(t)})}};t.$watch("currentPage",function(e,n){e||(e=n=1),g.currentOffset=(e-1)*h.pageSize,e===n-1?g.currentRow=g.currentOffset+h.pageSize-1:1===n&&e===Math.floor(g.data.length/h.pageSize+1)?g.currentRow=g.data.length-1:g.currentRow=g.currentOffset,t.reviewing||d("row"+g.currentRow);var r=[],a=g.currentOffset+h.pageSize;a>g.data.length&&(a=g.data.length);for(var o=g.currentOffset;o<a;o++)g.reconData[o]||r.push({index:o,text:g.data[o][0]});w(r)}),this.canceler=c.defer(),t.$watch("state.sparqlEndpoint",function(e,n){e&&(f.canceler.resolve(),f.canceler=c.defer(),s.check(e,{timeout:f.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))}),t.loadSPARQL=function(){f.canceler.resolve(),f.canceler=c.defer(),s.query(g.sparqlEndpoint,g.loadQuery,{timeout:f.canceler.promise}).then(function(e){var n={},r=e.data.head.vars[0];e.data.results.bindings.filter(function(t){return!!t[r]}).forEach(function(t){var a=t[r].value;n[a]||(n[a]={}),e.data.head.vars.forEach(function(e){t[e]&&(n[a][e]||(n[a][e]={}),n[a][e][t[e].value]=!0)})}),g.headings=e.data.head.vars,g.fileName="sparql-results.json",g.data=[];for(var a in n){var o=[];e.data.head.vars.forEach(function(t){var e="";for(var r in n[a][t])e+=r.replace(/\n/g," ")+", ";o.push(e.substr(0,e.length-2))}),g.data.push(o)}g.currentRow=0,g.currentOffset=0,t.currentPage=1,g.reconData=[];var c=[],s=g.currentOffset+h.pageSize;s>g.data.length&&(s=g.data.length);for(var i=g.currentOffset;i<s;i++)g.reconData[i]||c.push({index:i,text:g.data[i][0]});w(c)},b)},t.openSPARQL=function(){l.open({templateUrl:"loadSPARQL",scope:t,size:"lg"})},t.sort=function(){var e=t.state.data.map(function(t,e){return e});e.sort(function(e,n){var r=t.state.reconData[e],a=t.state.reconData[n];if(!r)return a?-1:0;if(!a)return 1;switch(r.matches){case void 0:return void 0===a.matches?0:-1;case null:switch(a.matches){case void 0:return 1;case null:return 0;default:return-1}default:return a.matches?0:1}});var n=[],r=[];e.forEach(function(e){n.push(t.state.data[e]),r.push(t.state.reconData[e])}),t.state.data=n,t.state.reconData=r},t.saveCSVFile=function(){var t=[],e=g.headings.slice();e.splice(1,0,"Match","Notes"),t.push(e),g.data.forEach(function(e,n){var r=e.slice();if(g.reconData[n])if(g.reconData[n].matches){var a;null!==g.reconData[n].matches&&(a=[]),g.reconData[n].matches.forEach(function(t){a.push(t.id)}),r.splice(1,0,a.join(", "),g.reconData[n].notes)}else r.splice(1,0,void 0,g.reconData[n].notes);else r.splice(1,0,void 0,void 0);t.push(r)});var n="reconciled-"+g.fileName.replace(/\..*?$/,".csv");saveAs(new Blob([Papa.unparse(t)],{type:"text/csv"}),n)};var j=function(e){g.headings=e[0].map(function(e,n){return t.firstRowIsHeader?e:"Column "+n}),g.data=e,g.data.splice(0,(t.skipRows?t.skipRows:0)+(t.firstRowIsHeader?1:0)),g.currentRow=0,g.currentOffset=0,g.counts={match:0,nomatch:0},t.currentPage=1,g.reconData=[];var n=[],r=g.currentOffset+h.pageSize;r>g.data.length&&(r=g.data.length);for(var a=g.currentOffset;a<r;a++)g.reconData[a]||n.push({index:a,text:g.data[a][0]});w(n)};t.loadSheet=function(){t.sheets.filter(function(t){return t.active}).forEach(function(t){return j(t.data)})},t.loadFile=function(e){if(e)if(g.fileName=e.name,0===e.type.indexOf("text/")||e.name.lastIndexOf(".csv")===e.name.length-4||e.name.lastIndexOf(".tsv")===e.name.length-4)Papa.parse(e,{complete:function(e){0!==e.errors.length&&b({data:e.errors.map(function(t){return t.message}).join("\n")}),t.sheets=[new r("Table")],t.firstRowIsHeader=!0,t.sheets[0].data=e.data,t.sheets[0].active=!0,l.open({templateUrl:"selectSheet",scope:t,size:"lg"})},error:function(t){return b({data:t.message})}});else{var n=new FileReader;n.onload=function(){try{var e=XLSX.read(n.result,{type:"binary"});t.sheets=[],e.SheetNames.forEach(function(n){var a=new r(n),o=XLSX.utils.sheet_to_json(e.Sheets[n]);a.data=[[]];for(var c in o[0])0!==c.indexOf("__")&&a.data[0].push(c);XLSX.utils.sheet_to_json(e.Sheets[n]).forEach(function(t){var e=[];a.data[0].forEach(function(n){return e.push(t[n])}),a.data.push(e)}),t.sheets.push(a)}),t.firstRowIsHeader=!0,t.sheets[0].active=!0,l.open({templateUrl:"selectSheet",scope:t,size:"lg"})}catch(e){b({data:e.message}),t.$digest()}},n.readAsBinaryString(e)}},t.deselect=function(){g.reconData[g.currentRow].matches&&g.counts.match--,g.counts.nomatch++,g.reconData[g.currentRow].matches=null,g.currentRow===g.currentOffset+h.pageSize-1?(t.currentPage++,(t.currentPage-1)*h.pageSize>g.data.length&&(t.currentPage=1)):d("row"+(g.currentRow+1))},t.select=function(e,n){g.reconData[g.currentRow].matches||(g.counts.match++,null===g.reconData[g.currentRow].matches&&g.counts.nomatch--,g.reconData[g.currentRow].matches=[]),n.shiftKey?g.reconData[g.currentRow].matches.filter(function(t){return t.id===g.reconData[g.currentRow].candidates[e].id}).length>0?(g.reconData[g.currentRow].matches=g.reconData[g.currentRow].matches.filter(function(t){return t.id!==g.reconData[g.currentRow].candidates[e].id}),0==g.reconData[g.currentRow].matches.length&&(g.counts.match--,g.reconData[g.currentRow].matches=void 0)):g.reconData[g.currentRow].matches.push(g.reconData[g.currentRow].candidates[e]):(g.reconData[g.currentRow].matches=[],g.reconData[g.currentRow].matches.push(g.reconData[g.currentRow].candidates[e]),g.currentRow===g.currentOffset+h.pageSize-1?(t.currentPage++,(t.currentPage-1)*h.pageSize>g.data.length&&(t.currentPage=1)):d("row"+(g.currentRow+1))),document.getSelection().removeAllRanges()},t.focus=function(e,n){t.reviewing=!1,g.currentRow=e,!v||g.reconData[e]&&g.reconData[e].candidates&&0!==g.reconData[e].candidates.length||w([{text:n,index:e}])},t.search=function(t,e){return w([{text:e,index:t}])},t.isIdInObjectArray=function(t,e){return e.filter(function(e){return e.id==t}).length>0}}return t}();angular.module("app").controller("ProjectController",["$scope","$localStorage","$state","$stateParams","$q","sparqlService","hotkeys","$uibModal","$sce","focus","base64",function(){return new(Function.prototype.bind.apply(a,[null].concat(Array.prototype.slice.apply(arguments))))}]),e.ProjectController=a}(n=e.recon||(e.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,n){this.name=t,this.total=e,this.counts=n}return t}(),n=function(){function t(t,n,r,a){r.projects||(r.projects={}),t.projects=[];for(var o in r.projects)r.projects[o].state?t.projects.push(new e(o,r.projects[o].state.data.length,r.projects[o].state.counts)):t.projects.push(new e(o,0,{match:0,nomatch:0}));t.newProject=function(t){n.go("project",{projectId:t})},t.maybeDeleteAll=function(){var e=a.open({templateUrl:"deleteAll"});e.result.then(function(){r.projects={},t.projects=[]})}}return t}();angular.module("app").controller("ProjectListController",["$scope","$state","$localStorage","$uibModal",function(){return new(Function.prototype.bind.apply(n,[null].concat(Array.prototype.slice.apply(arguments))))}]),t.ProjectListController=n}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,n,r,a,o,c,s){var i=this;if(n.configURL)s.get(n.configURL).then(function(t){e.projects[n.projectId]=t.data,r.go("project",{projectId:n.projectId})});else{t.projectId=n.projectId,e.projects[n.projectId].config||(e.projects[n.projectId].config={sparqlEndpoint:"http://",pageSize:15,matchQuery:"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n  SELECT ?queryId ?entity ?label ?score {\n    { # QUERY\n      {\n        SELECT ?entity {\n          BIND(<QUERY> AS ?label)\n          ?entity rdfs:label|skos:prefLabel ?label .\n        }\n        LIMIT 30\n      }\n      BIND(1.0 AS ?score)\n      BIND(<CELL_1> AS ?cell1)\n      BIND(<QUERY_ID> AS ?queryId)\n    } # /QUERY\n    ?entity rdfs:label|skos:prefLabel ?label .\n  }",loadSparqlEndpoint:void 0,loadQuery:void 0}),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,this.canceler=a.defer(),t.otherProjects=[];for(var l in e.projects)l!==n.projectId&&t.otherProjects.push(l);t.copyProject=function(r){e.projects[n.projectId]=e.projects[r],t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state},t.importProject=function(r){if(r){var a=new FileReader;a.onload=function(){e.projects[n.projectId]=JSON.parse(a.result),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,t.$digest()},a.readAsText(r)}},t.deleteProject=function(){delete e.projects[n.projectId],r.go("projectlist")},t.exportProject=function(){saveAs(new Blob([JSON.stringify(e.projects[n.projectId])],{type:"application/json"}),n.projectId+".json")},t.deleteData=function(){e.projects[n.projectId].state=null,t.state=null},t.$watch("config.sparqlEndpoint",function(e,n){e&&(i.canceler.resolve(),i.canceler=a.defer(),o.check(e,{timeout:i.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))})}}return t}();angular.module("app").controller("ConfigureController",["$scope","$localStorage","$stateParams","$state","$q","sparqlService","base64","$http",function(){return new(Function.prototype.bind.apply(e,[null].concat(Array.prototype.slice.apply(arguments))))}]),t.ConfigureController=e}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={})),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("components/configure.html",'\n<div class="container">\n  <div class="form-group" ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'">\n    <label>SPARQL endpoint</label>\n    <input class="form-control" type="text" ng-model="config.sparqlEndpoint"/>\n  </div>\n  <div class="form-group">\n    <label>Match and short description query</label>\n    <yasqe data="config.matchQuery"></yasqe>\n  </div>\n  <div class="form-group">\n    <label>Entries per page</label>\n    <input class="form-control" type="number" ng-model="config.pageSize"/>\n  </div>\n  <div class="form-group">\n    <button class="btn btn-success" ui-sref="project({projectId:projectId})">Return to project</button>\n  </div>\n  <div class="form-group">\n    <select class="form-control" ng-options="project for project in otherProjects" ng-model="copyProjectFrom" ng-change="copyProject(copyProjectFrom);copyProjectFrom=null">\n      <option value="">Copy project from:</option>\n    </select>\n  </div>\n  <div class="form-group">\n    <button class="btn btn-warning" ngf-select="ngf-select" ngf-change="importProject($files[0])" ngf-multiple="false">Import project</button>\n    <button class="btn btn-warning" ng-click="exportProject()">Export project</button>\n  </div>\n  <div class="form-group">\n    <button class="btn btn-danger" ng-click="deleteData()" ng-show="state.data.length&gt;0">Delete project data ({{state.data.length}} rows)</button>\n    <button class="btn btn-danger" ng-click="deleteProject()">Delete project</button>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("components/project.html",'\n<script type="text/ng-template" id="selectSheet">\n  <div class="modal-header">\n    <h3 class="modal-title">Preview</h3>\n  </div>\n  <div class="modal-body">\n    <uib-tabset>\n      <uib-tab ng-repeat="sheet in sheets" heading="{{sheet.name}}" deselect="sheet.active=false" select="sheet.active=true">\n        <div ng-show="error">\n          <h4>{{error.status}}\n            <button class="pull-right btn btn-xs btn-danger" ng-click="$parent.error=\'\';queryRunning=false">X</button>\n          </h4>\n          <div class="clearfix"></div>\n          <pre class="pre-scrollable">{{error.data}}</pre>\n          <pre class="pre-scrollable" ng-show="error.config">{{error.config}}</pre>\n        </div>\n        <div style="overflow:scroll;max-height:500px;">\n          <table class="table table-bordered table-striped">\n            <tr>\n              <th ng-if="firstRowIsHeader" ng-repeat="header in sheet.data[0] track by $index">{{header}}</th>\n              <th ng-if="!firstRowIsHeader" ng-repeat="header in sheet.data[0] track by $index">Column {{$index}}</th>\n            </tr>\n            <tr ng-repeat="row in sheet.data | limitTo:10:(skipRows+(firstRowIsHeader ? 1 : 0)) track by $index">\n              <td ng-repeat="column in row track by $index">{{column}}</td>\n            </tr>\n          </table>\n        </div>\n      </uib-tab>\n    </uib-tabset>\n  </div>\n  <div class="modal-footer">\n    <div class="checkbox">\n      <label>\n        <input type="checkbox" ng-model="$parent.firstRowIsHeader"/>Use first row as header\n      </label>\n    </div>\n    <input type="number" ng-model="$parent.skipRows" placeholder="skip rows"/>\n    <button class="btn btn-success" ng-click="$close();loadSheet()">Load</button>\n  </div>\n</script>\n<script type="text/ng-template" id="popover">\n  <table class="table table-condensed table-bordered table-striped">\n    <tr ng-repeat="descr in candidate.additionalDescription track by $index">\n      <th>{{state.additionalDescriptionHeadings[$index]}}</th>\n      <td ng-bind-html="descr | trustAsHtml"></td>\n    </tr>\n  </table>\n</script>\n<script type="text/ng-template" id="loadSPARQL">\n  <div class="modal-header">\n    <h3 class="modal-title">Load from a SPARQL endpoint</h3>\n  </div>\n  <div class="modal-body">\n    <div class="form-group" ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'">\n      <label>SPARQL endpoint</label>\n      <input class="form-control" type="text" ng-model="state.sparqlEndpoint"/>\n    </div>\n    <div class="form-group">\n      <label>Load query</label>\n      <yasqe data="state.loadQuery"></yasqe>\n      <yasr></yasr>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button class="btn btn-success" ng-click="$close();loadSPARQL()">Ok</button>\n  </div>\n</script>\n<div class="container-fluid" style="max-width:97%;">\n  <div class="row">\n    <div ng-class="reviewing ? \'col-xs-12\' : \'col-xs-3\'">\n      <table class="table table-bordered table-striped">\n        <tr ng-if="reviewing">\n          <th>Name</th>\n          <th ng-repeat="header in state.headings track by $index">{{header}}</th>\n          <th>Match</th>\n          <th>Notes</th>\n          <th ng-repeat="header in state.descriptionHeadings track by $index">{{header}}</th>\n        </tr>\n        <tr ng-repeat="row in state.data | limitTo : config.pageSize : state.currentOffset">\n          <td ng-class="state.reconData[state.currentOffset + $index].matches ? \'success\' : (state.reconData[state.currentOffset + $index].matches === null ? \'warning\' : \'danger\')">\n            <input class="form-control" tooltip-placement="bottom" uib-tooltip="{{state.reconData[state.currentOffset + $index].matches[0].id ? state.reconData[state.currentOffset + $index].matches[0].label + \' (\' + state.reconData[state.currentOffset + $index].matches[0].id + \')\' + (state.reconData[state.currentOffset + $index].matches.length&gt;1 ? \' + \' + (state.reconData[state.currentOffset + $index].matches.length-1) + \' other(s)\' : \'\') : \'\'}}" select-on-focus="select-on-focus" focus-on="row{{state.currentOffset + $index}}" type="text" ng-init="input=row[0]" ng-model="input" ng-model-options="{debounce: 300}" ng-focus="focus(state.currentOffset + $index,input)" ng-change="search(state.currentOffset + $index,input)"/><span ng-if="reviewing" style="visibility:hidden;white-space:nowrap;">{{row[0]}}</span>\n          </td>\n          <td ng-if="reviewing" ng-repeat="value in row | limitTo:100:1 track by $index ">{{value}}</td>\n          <td ng-if="reviewing" ng-class="state.reconData[state.currentOffset + $index].matches ? \'info\' : (state.reconData[state.currentOffset + $index].matches === null ? \'warning\' : \'danger\')">{{state.reconData[state.currentOffset + $index].matches[0].id ? state.reconData[state.currentOffset + $index].matches[0].label + \' (\' + state.reconData[state.currentOffset + $index].matches[0].id + \')\' + (state.reconData[state.currentOffset + $index].matches.length>1 ? \' + \' + (state.reconData[state.currentOffset + $index].matches.length-1) + \' other(s)\' : \'\') : ( state.reconData[state.currentOffset + $index].matches === null ? \'none\' : \'not processed\')}}</td>\n          <td ng-if="reviewing" style="white-space: pre-line;">{{state.reconData[state.currentOffset + $index].notes}}</td>\n          <td class="info" ng-if="reviewing" ng-repeat="descr in state.reconData[state.currentOffset + $index].matches[0].description track by $index" ng-bind-html="descr | trustAsHtml"></td>\n        </tr>\n      </table>\n      <ul class="pagination-sm" uib-pagination="uib-pagination" ng-model="currentPage" items-per-page="config.pageSize" max-size="4" total-items="state.data.length" boundary-links="true" previous-text="‹" next-text="›" first-text="«" last-text="»"></ul>\n      <uib-progress>\n        <uib-bar type="success" value="100 * state.counts.match / state.data.length">{{state.counts.match}}</uib-bar>\n        <uib-bar type="warning" value="100 * state.counts.nomatch / state.data.length">{{state.counts.nomatch}}</uib-bar>&nbsp;{{state.data.length - state.counts.match - state.counts.nomatch}}\n      </uib-progress>\n      <div class="clearfix">\n        <button class="btn btn-success" ng-click="reviewing=!reviewing">Review</button>\n        <button class="btn btn-success" ng-click="sort()">Sort</button>\n        <button class="btn btn-success" ngf-select="ngf-select" ngf-change="loadFile($files[0])" ngf-multiple="false">Load File</button>\n        <button class="btn btn-success" ng-click="openSPARQL()">Load SPARQL</button>\n        <button class="btn btn-warning" ng-click="saveCSVFile()" ng-show="state.data.length&gt;0">Export CSV</button>\n        <button class="btn btn-default" ui-sref="configure({projectId:projectId})">Configure</button>\n        <button class="btn btn-default" ui-sref="projectlist">Back to project list</button>\n      </div>\n    </div>\n    <div class="col-xs-9" style="max-height:95vh;overflow-y:auto;" ng-if="!reviewing"><i class="fa fa-spinner fa-spin" ng-show="queryRunning &amp;&amp; !error"></i>\n      <div ng-show="error">\n        <h4>{{error.status}}\n          <button class="pull-right btn btn-xs btn-danger" ng-click="$parent.error=\'\';queryRunning=false">X</button>\n        </h4>\n        <div class="clearfix"></div>\n        <pre class="pre-scrollable">{{error.data}}</pre>\n        <pre class="pre-scrollable" ng-show="error.config">{{error.config}}</pre>\n      </div>\n      <table class="table table-bordered table-striped">\n        <tr class="header">\n          <th ng-repeat="header in state.headings track by $index">{{header.split("_").join(" ")}}</th>\n        </tr>\n        <tr>\n          <td ng-repeat="value in state.data[state.currentRow] track by $index">{{value}}</td>\n        </tr>\n      </table>\n      <div class="form-group">\n        <label>Notes</label>\n        <textarea class="form-control" ng-model="state.reconData[state.currentRow].notes"></textarea>\n      </div>\n      <button class="btn btn-block btn-warning" ng-show="!state.reconData[state.currentRow].candidates">?</button>\n      <table class="table table-bordered table-striped">\n        <tr class="header">\n          <th></th>\n          <th>Match</th>\n          <th ng-repeat="header in state.descriptionHeadings track by $index">{{header.split("_").join(" ")}}</th>\n        </tr>\n        <tr ng-class="state.reconData[state.currentRow].matches === null ? \'info\' : \'warning\'">\n          <th ng-click="deselect()" style="cursor:pointer;">0</th>\n          <th ng-click="deselect()" style="cursor:pointer;">None of the below</th>\n          <td ng-repeat="descr in state.reconData[state.currentRow].candidates[0].description track by $index"></td>\n        </tr>\n        <tr ng-repeat="candidate in state.reconData[state.currentRow].candidates | limitTo : 29" ng-style="{\'background-color\':candidate.color}" ng-class="state.reconData[state.currentRow].matches &amp;&amp; isIdInObjectArray(candidate.id, state.reconData[state.currentRow].matches) ? \'info\' : \'\'" popover-enable="candidate.additionalDescription.length!=0" popover-trigger="\'mouseenter\'" uib-popover-template="\'popover\'">\n          <th ng-if="$index&lt;9" ng-click="select($index,$event)" style="cursor:pointer;">{{$index+1}}</th>\n          <th ng-if="$index&gt;=9" ng-click="select($index,$event)" style="cursor:pointer;">-</th>\n          <th ng-click="select($index,$event)" style="cursor:pointer;">{{candidate.label}}</th>\n          <td ng-repeat="descr in candidate.description track by $index" ng-bind-html="descr | trustAsHtml"></td>\n        </tr>\n      </table>\n      <button class="btn btn-block btn-danger" ng-show="state.reconData[state.currentRow].candidates.length==30">...</button>\n    </div>\n    <div class="row">\n      <div class="col-xs-12"></div>\n    </div>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("components/projectlist.html",'\n<script type="text/ng-template" id="deleteAll">\n  <div class="modal-header">\n    <h3 class="modal-title">Are you sure?</h3>\n  </div>\n  <div class="modal-body">Deleting all projects will clear from your local browser storage all data associated with them.</div>\n  <div class="modal-footer">\n    <button class="btn btn-success" ng-click="$dismiss()">No</button>\n    <button class="btn btn-danger" ng-click="$close()">Yes</button>\n  </div>\n</script>\n<div class="container">\n  <h3>Projects:</h3>\n  <div class="row" ng-repeat="project in projects">\n    <div class="col-xs-2">\n      <ul>\n        <li><a ui-sref="project({projectId:project.name})">{{project.name}}</a></li>\n      </ul>\n    </div>\n    <div class="col-xs-4">\n      <uib-progress style="margin-bottom:0px;">\n        <uib-bar type="success" value="100 * project.counts.match / project.total">{{project.counts.match}}</uib-bar>\n        <uib-bar type="warning" value="100 * project.counts.nomatch / project.total">{{project.counts.nomatch}}</uib-bar>&nbsp;{{project.total - project.counts.match - project.counts.nomatch}}\n      </uib-progress>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-xs-12">\n      <ul>\n        <li>\n          <form class="form-inline" ng-submit="newProject(newProjectId)">\n            <input class="form-control" type="text" ng-model="newProjectId"/>\n          </form>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-xs-12">\n      <button class="btn btn-danger" ng-click="maybeDeleteAll()">Delete all projects</button>\n    </div>\n  </div>\n</div>')}])}();