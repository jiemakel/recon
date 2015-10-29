var app;!function(t){var e=angular.module("app",["ui.router","ngStorage","ngFileUpload","ui.bootstrap","ui.bootstrap.tpls","ab-base64","http-auth-interceptor","cfp.hotkeys","focusOn"]);e.config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/"),t.state("projectlist",{url:"/",templateUrl:"partials/projectlist.html",controller:"ProjectListController"}),t.state("project",{url:"/:projectId/",templateUrl:"partials/project.html",controller:"ProjectController"}),t.state("configure",{url:"/:projectId/configure",templateUrl:"partials/configure.html",controller:"ConfigureController"})}]),e.run(["$rootScope","$http","authService",function(t,e,n){t.authInfo={authOpen:!1,username:void 0,password:void 0},t.setAuth=function(){t.authInfo.authOpen=!1,e.defaults.headers.common.Authorization="Basic "+btoa(t.authInfo.username+":"+t.authInfo.password),n.loginConfirmed()},t.dismissAuth=function(){t.authInfo.authOpen=!1,n.loginCancelled({status:401},"Authentication required")},t.$on("event:auth-loginRequired",function(){return t.authInfo.authOpen=!0})}]);var n=function(){function t(){this.restrict="A",this.link=function(t,e,n){e.on("mouseup",function(t){t.preventDefault()}),e.on("focus",function(t){this.select()})}}return t.$inject=[],t.$componentName="selectOnFocus",t}();angular.module("app").directive("selectOnFocus",[function(){return new(Function.prototype.bind.apply(n,[null].concat(Array.prototype.slice.call(arguments))))}]),t.SelectOnFocusDirective=n}(app||(app={}));var app;!function(t){var e=function(){function t(t){var e=this;this.$timeout=t,this.restrict="E",this.scope={data:"=data",endpoint:"=endpoint"},this.link=function(t,n,r){var a=YASQE(n[0],{createShareLink:!1,sparql:{showQueryButton:!1}});a.on("change",function(){return e.$timeout(function(){return t.data=a.getValue()})}),t.$watch("data",function(t,e){t&&t!=a.getValue()&&a.setValue(t)}),t.$watch("endpoint",function(t){t&&(a.options.sparql.endpoint=t)})}}return t.$inject=["$timeout"],t.$componentName="yasqe",t}();angular.module("app").directive("yasqe",["$timeout",function(){return new(Function.prototype.bind.apply(e,[null].concat(Array.prototype.slice.call(arguments))))}]),t.YasqeDirective=e}(app||(app={}));var app;!function(t){var e=function(){function t(t,e){this.$http=t,this.$q=e}return t.$inject=["$http","$q"],t.$componentName="sparqlService",t.prototype.check=function(t,e){var n=this.$q.defer();return this.$http(angular.extend({method:"GET",url:t,params:{query:"ASK {}"},headers:{Accept:"application/sparql-results+json"}},e)).then(function(t){return n.resolve(t.data["boolean"]===!0)},function(t){return n.resolve(!1)}),n.promise},t.prototype.checkUpdate=function(t,e){var n=this.$q.defer();return this.$http(angular.extend({method:"POST",url:t,headers:{"Content-Type":"application/sparql-update"},data:"INSERT DATA {}"},e)).then(function(t){return n.resolve(204===t.status)},function(t){return n.resolve(!1)}),n.promise},t.prototype.checkRest=function(t,e){var n=this.$q.defer();return this.$http(angular.extend({method:"POST",url:t+"?default",data:"",headers:{"Content-Type":"text/turtle"}},e)).then(function(t){return n.resolve(204===t.status)},function(t){return n.resolve(!1)}),n.promise},t.prototype.get=function(t,e,n){return this.$http(angular.extend({method:"GET",url:t,params:null!=e?{graph:e}:{"default":""},headers:{Accept:"text/turtle"}},n))},t.prototype.post=function(t,e,n,r){return this.$http(angular.extend({method:"POST",url:t,params:null!=n?{graph:n}:{"default":""},data:e,headers:{"Content-Type":"text/turtle"}},r))},t.prototype.put=function(t,e,n,r){return this.$http(angular.extend({method:"PUT",url:t,params:null!=n?{graph:n}:{"default":""},data:e,headers:{"Content-Type":"text/turtle"}},r))},t.prototype["delete"]=function(t,e,n){return this.$http(angular.extend({method:"DELETE",url:t,params:null!=e?{graph:e}:{"default":""}},n))},t.prototype.query=function(t,e,n){return e.length<=2048?this.$http(angular.extend({method:"GET",url:t,params:{query:e},headers:{Accept:"application/sparql-results+json"}},n)):this.$http(angular.extend({method:"POST",url:t,data:e,headers:{"Content-Type":"application/sparql-query",Accept:"application/sparql-results+json"}},n))},t.prototype.construct=function(t,e,n){return e.length<=2048?this.$http(angular.extend({method:"GET",url:t,params:{query:e},headers:{Accept:"text/turtle"}},n)):this.$http(angular.extend({method:"POST",url:t,data:e,headers:{"Content-Type":"application/sparql-query",Accept:"text/turtle"}},n))},t.prototype.update=function(t,e,n){return this.$http(angular.extend({method:"POST",url:t,headers:{"Content-Type":"application/sparql-update"},data:e},n))},t.prototype.stringToSPARQLString=function(t){return"'"+t.replace(/'/g,"\\'")+"'"},t.prototype.bindingToString=function(t){if(null==t)return"UNDEF";var e=t.value.replace(/\\/g,"\\\\").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\b]/g,"\\b").replace(/\f/g,"\\f").replace(/\'/g,"\\'").replace(/\"/g,'\\"');if("uri"==t.type)return"<"+e+">";if("bnode"==t.type)return"_:"+e;if(null==t.datatype)return t["xml:lang"]?'"'+e+'"@'+t["xml:lang"]:'"'+e+'"';switch(t.datatype){case"http://www.w3.org/2001/XMLSchema#integer":case"http://www.w3.org/2001/XMLSchema#decimal":case"http://www.w3.org/2001/XMLSchema#double":case"http://www.w3.org/2001/XMLSchema#boolean":return e;case"http://www.w3.org/2001/XMLSchema#string":return'"'+e+'"';default:return'"'+e+'"^^<'+t.datatype+">"}},t}();angular.module("app").service("sparqlService",e),t.SparqlService=e}(app||(app={}));var app;!function(t){var e=function(){function t(t,e,n,r,a,o,c,s,l,i,u){var p=this;t.projectId=r.projectId,e.projects||(e.projects={}),e.projects[r.projectId]||(e.projects[r.projectId]={config:null,state:null});var d=e.projects[r.projectId].config;if(!d)return void n.go("configure",{projectId:r.projectId});t.config=d,e.projects[r.projectId].state||(e.projects[r.projectId].state={currentRow:0,currentOffset:0,reconData:[],data:[],sparqlEndpoint:void 0,loadQuery:void 0,fileName:void 0,counts:{match:0,nomatch:0}});var f=e.projects[r.projectId].state;t.state=f,t.currentPage=f.currentOffset/d.pageSize+1,c.bindTo(t).add({combo:"shift+tab",allowIn:["INPUT"],callback:function(e,n){f.currentRow==f.currentOffset&&(t.currentPage--,0==t.currentPage&&(t.currentPage=Math.floor(f.data.length/d.pageSize+1)))}}),c.bindTo(t).add({combo:"tab",allowIn:["INPUT"],callback:function(e,n){(f.currentRow==f.currentOffset+d.pageSize-1||f.currentRow==f.data.length-1)&&(t.currentPage++,(t.currentPage-1)*d.pageSize>f.data.length&&(t.currentPage=1))}}),c.bindTo(t).add({combo:"0",allowIn:["INPUT"],callback:function(e,n){f.reconData[f.currentRow]||(f.reconData[f.currentRow]={match:void 0,candidates:[]}),f.reconData[f.currentRow].match&&f.counts.match--,f.counts.nomatch++,f.reconData[f.currentRow].match=null,f.currentRow==f.currentOffset+d.pageSize-1?(t.currentPage++,(t.currentPage-1)*d.pageSize>f.data.length&&(t.currentPage=1)):i("row"+(f.currentRow+1)),e.preventDefault()}});for(var h=1;10>h;h++)c.bindTo(t).add({combo:""+h,allowIn:["INPUT"],callback:function(e,n){f.reconData[f.currentRow].match||(f.counts.match++,null===f.reconData[f.currentRow].match&&f.counts.nomatch--),f.reconData[f.currentRow].match=f.reconData[f.currentRow].candidates[parseInt(n.combo[0])-1],f.currentRow==f.currentOffset+d.pageSize-1?(t.currentPage++,(t.currentPage-1)*d.pageSize>f.data.length&&(t.currentPage=1)):i("row"+(f.currentRow+1)),e.preventDefault()}});var g=function(e){return t.error=e};t.$watch("currentPage",function(t,e){t||(t=e=1),f.currentOffset=(t-1)*d.pageSize,t==e-1?f.currentRow=f.currentOffset+d.pageSize-1:1==e&&t==Math.floor(f.data.length/d.pageSize+1)?f.currentRow=f.data.length-1:f.currentRow=f.currentOffset,i("row"+f.currentRow);var n=[],r=f.currentOffset+d.pageSize;r>f.data.length&&(r=f.data.length);for(var a=f.currentOffset;r>a;a++)f.reconData[a]||n.push({index:a,text:f.data[a][0]});v(n)}),this.canceler=a.defer(),t.$watch("state.sparqlEndpoint",function(e,n){e&&(p.canceler.resolve(),p.canceler=a.defer(),o.check(e,{timeout:p.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))}),t.loadSPARQL=function(){p.canceler.resolve(),p.canceler=a.defer(),o.query(f.sparqlEndpoint,f.loadQuery,{timeout:p.canceler.promise}).then(function(e){var n={},r=e.data.head.vars[0];e.data.results.bindings.filter(function(t){return t.entity?!0:!1}).forEach(function(t){var a=t[r].value;n[a]||(n[a]={}),e.data.head.vars.forEach(function(e){t[e]&&(n[a][e]||(n[a][e]={}),n[a][e][t[e].value]=!0)})}),f.data=[];for(var a in n){var o=[];e.data.head.vars.forEach(function(t){var e="";for(var r in n[a][t])e+=r+", ";o.push(e.substr(0,e.length-2))}),o.splice(1,0,a),f.data.push(o)}f.currentRow=0,f.currentOffset=0,t.currentPage=1,f.reconData=[];var c=[],s=f.currentOffset+d.pageSize;s>f.data.length&&(s=f.data.length);for(var l=f.currentOffset;s>l;l++)f.reconData[l]||c.push({index:l,text:f.data[l][0]});v(c)},g)},t.openSPARQL=function(){s.open({templateUrl:"loadSPARQL",scope:t,size:"lg"})},t.saveCSVFile=function(){var t=[];f.data.forEach(function(e,n){var r=e.slice();f.reconData[n]&&f.reconData[n].match?r.splice(1,0,f.reconData[n].match.id):r.splice(1,0,void 0),t.push(r)}),saveAs(new Blob([Papa.unparse(t)],{type:"text/csv"}),"reconciled-"+f.fileName)},t.loadCSVFile=function(e){e&&(f.fileName=e.name,Papa.parse(e,{complete:function(e){f.data=e.data,f.currentRow=0,f.currentOffset=0,f.counts={match:0,nomatch:0},t.currentPage=1,f.reconData=[];var n=[],r=f.currentOffset+d.pageSize;r>f.data.length&&(r=f.data.length);for(var a=f.currentOffset;r>a;a++)f.reconData[a]||n.push({index:a,text:f.data[a][0]});v(n),t.$digest(),{error:g}}}))};var m=!1,v=function(e){if(e=e.filter(function(t){return""!=t.text}),0!=e.length){var n=d.matchQuery.split(/[\{\}] # \/?QUERY/),r=n[0];e.forEach(function(t){var e=n[1].replace(/<QUERY_ID>/g,""+t.index).replace(/<QUERY>/g,o.stringToSPARQLString(t.text));f.data[t.index].forEach(function(t,n){e=e.replace(new RegExp("<CELL_"+n+">","g"),o.stringToSPARQLString(t))}),r+="{"+e+"} UNION"}),r=r.substring(0,r.length-6)+n[2],p.canceler.resolve(),t.queryRunning=!0,p.canceler=a.defer(),t.$sce=l,o.query(d.sparqlEndpoint,r,{timeout:p.canceler.promise}).then(function(n){e.length>1&&(m=!1),e.forEach(function(t){f.reconData[t.index]&&delete f.reconData[t.index].candidates}),t.error=void 0,t.queryRunning=!1;var r={};n.data.results.bindings.filter(function(t){return t.entity?!0:!1}).forEach(function(t,e){r[t.queryId.value]||(r[t.queryId.value]={});var a=r[t.queryId.value];a[t.entity.value]||(a[t.entity.value]={index:e,id:t.entity.value,label:t.label.value,color:"rgb(127,"+Math.floor(127+127*parseFloat(t.score.value))+",127)",description:[]}),n.data.head.vars.filter(function(t){return"queryId"!=t&&"entity"!=t&&"label"!=t&&"score"!=t}).forEach(function(e){return a[t.entity.value].description.push(t[e]?t[e].value:"")})});for(var a in r){f.reconData[a]||(f.reconData[a]={match:void 0,candidates:[]});var o=[];for(var c in r[a])o.push(r[a][c]);o.sort(function(t,e){return t.index-e.index}),f.reconData[a].candidates=o}},function(t){e.length>1?(m=!0,v([{text:f.data[f.currentRow][0],index:f.currentRow}])):g(t)})}};t.select=function(e){f.reconData[f.currentRow].match||(f.counts.match++,null===f.reconData[f.currentRow].match&&f.counts.nomatch--),f.reconData[f.currentRow].match=f.reconData[f.currentRow].candidates[e],f.currentRow==f.currentOffset+d.pageSize-1?(t.currentPage++,(t.currentPage-1)*d.pageSize>f.data.length&&(t.currentPage=1)):i("row"+(f.currentRow+1))},t.focus=function(t,e){f.currentRow=t,!m||f.reconData[t]&&f.reconData[t].candidates&&0!=f.reconData[t].candidates.length||v([{text:e,index:t}])},t.search=function(t,e){return v([{text:e,index:t}])}}return t.$inject=["$scope","$localStorage","$state","$stateParams","$q","sparqlService","hotkeys","$modal","$sce","focus","base64"],t.$componentName="ProjectController",t}();angular.module("app").controller("ProjectController",e),t.ProjectController=e}(app||(app={}));var app;!function(t){var e=function(){function t(t,e,n){this.name=t,this.total=e,this.counts=n}return t}(),n=function(){function t(t,n,r){r.projects||(r.projects={}),t.projects=[];for(var a in r.projects)t.projects.push(new e(a,r.projects[a].state.data.length,r.projects[a].state.counts));t.newProject=function(t){n.go("project",{projectId:t})}}return t.$inject=["$scope","$state","$localStorage"],t.$componentName="ProjectListController",t}();angular.module("app").controller("ProjectListController",n),t.ProjectListController=n}(app||(app={}));var app;!function(t){var e=function(){function t(t,e,n,r,a,o,c){var s=this;t.projectId=n.projectId,e.projects[n.projectId].config||(e.projects[n.projectId].config={sparqlEndpoint:"http://",pageSize:15,matchQuery:"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nSELECT ?queryId ?entity ?label ?score {\n  { # QUERY\n    {\n      SELECT ?entity {\n        BIND(<QUERY> AS ?label)\n        ?entity rdfs:label|skos:prefLabel ?label .\n      }\n      LIMIT 30\n    }\n    BIND(1.0 AS ?score)\n    BIND(<CELL_1> AS ?cell1)\n    BIND(<QUERY_ID> AS ?queryId)\n  } # /QUERY\n  ?entity rdfs:label|skos:prefLabel ?label .\n}"}),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,this.canceler=a.defer(),t.importProject=function(r){var a=new FileReader;a.onload=function(){e.projects[n.projectId]=JSON.parse(a.result),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,t.$digest()},a.readAsText(r)},t.deleteProject=function(){delete e.projects[n.projectId],r.go("projectlist")},t.exportProject=function(){saveAs(new Blob([JSON.stringify(e.projects[n.projectId])],{type:"application/json"}),n.projectId+".json")},t.deleteData=function(){e.projects[n.projectId].state=null,t.state=null},t.$watch("config.sparqlEndpoint",function(e,n){e&&(s.canceler.resolve(),s.canceler=a.defer(),o.check(e,{timeout:s.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))})}return t.$inject=["$scope","$localStorage","$stateParams","$state","$q","sparqlService","base64"],t.$componentName="ConfigureController",t}();angular.module("app").controller("ConfigureController",e),t.ConfigureController=e}(app||(app={})),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/configure.html",'\n<div class="container">\n  <div ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'" class="form-group">\n    <label>SPARQL endpoint</label>\n    <input type="text" ng-model="config.sparqlEndpoint" class="form-control"/>\n  </div>\n  <div class="form-group">\n    <label>Match and short description query</label>\n    <yasqe data="config.matchQuery"></yasqe>\n  </div>\n  <div class="form-group">\n    <label>Entries per page</label>\n    <input type="number" ng-model="config.pageSize" class="form-control"/>\n  </div>\n  <div class="form-group">\n    <button ui-sref="project({projectId:projectId})" class="btn btn-success">Return to project</button>\n  </div>\n  <div class="form-group">\n    <button ngf-select="ngf-select" ngf-change="importProject($files[0])" ngf-multiple="false" class="btn btn-warning">Import project</button>\n    <button ng-click="exportProject()" class="btn btn-warning">Export project</button>\n  </div>\n  <div class="form-group">\n    <button ng-click="deleteData()" ng-show="state.data.length&gt;0" class="btn btn-danger">Delete project data ({{state.data.length}} rows)</button>\n    <button ng-click="deleteProject()" class="btn btn-danger">Delete project</button>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/project.html",'\n<script type="text/ng-template" id="loadSPARQL">\n  <div class="modal-header">\n    <h3 class="modal-title">Load from a SPARQL endpoint</h3>\n  </div>\n  <div class="modal-body">\n    <div ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'" class="form-group">\n      <label>SPARQL endpoint</label>\n      <input type="text" ng-model="state.sparqlEndpoint" class="form-control"/>\n    </div>\n    <div class="form-group">\n      <label>Load query</label>\n      <yasqe data="state.loadQuery"></yasqe>\n      <yasr></yasr>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button ng-click="$close();loadSPARQL()" class="btn btn-success">Ok</button>\n  </div>\n</script>\n<div style="max-width:97%" class="container-fluid">\n  <div class="row">\n    <div class="col-xs-3">\n      <table class="table table-bordered table-striped">\n        <tr ng-repeat="row in state.data | limitTo : config.pageSize : state.currentOffset">\n          <td ng-class="state.reconData[state.currentOffset + $index].match ? \'has-success\' : (state.reconData[state.currentOffset + $index].match === null ? \'has-warning\' : \'has-error\')">\n            <input tooltip-placement="right" tooltip="{{state.reconData[state.currentOffset + $index].match.id ? state.reconData[state.currentOffset + $index].match.label + \' (\' + state.reconData[state.currentOffset + $index].match.id + \')\' : \'\'}}" select-on-focus="select-on-focus" focus-on="row{{state.currentOffset + $index}}" type="text" ng-init="input=row[0]" ng-model="input" ng-model-options="{debounce: 300}" ng-focus="focus(state.currentOffset + $index,input)" ng-change="search(state.currentOffset + $index,input)" class="form-control"/>\n          </td>\n        </tr>\n      </table>\n      <pagination ng-model="currentPage" items-per-page="config.pageSize" max-size="4" total-items="state.data.length" boundary-links="true" previous-text="‹" next-text="›" first-text="«" last-text="»" class="pagination-sm"></pagination>\n      <progress>\n        <bar type="success" value="100 * state.counts.match / state.data.length">{{state.counts.match}}</bar>\n        <bar type="warning" value="100 * state.counts.nomatch / state.data.length">{{state.counts.nomatch}}</bar>&nbsp;{{state.data.length - state.counts.match - state.counts.nomatch}}\n      </progress>\n      <div class="clearfix">\n        <button ngf-select="ngf-select" ngf-change="loadCSVFile($files[0])" ngf-multiple="false" class="btn btn-success">Load CSV</button>\n        <button ng-click="openSPARQL()" class="btn btn-success">Load SPARQL</button>\n        <button ng-click="saveCSVFile()" ng-show="state.data.length&gt;0" class="btn btn-warning">Export CSV</button>\n        <button ui-sref="configure({projectId:projectId})" class="btn btn-default">Configure</button>\n      </div>\n    </div>\n    <div style="max-height:95vh;overflow-y:auto" class="col-xs-9"><i ng-show="queryRunning &amp;&amp; !error" class="fa fa-spinner fa-spin"></i>\n      <div ng-show="error">\n        <h4>{{error.status}}\n          <button ng-click="error=\'\';queryRunning=false" class="pull-right btn btn-xs btn-danger">X</button>\n        </h4>\n        <div class="clearfix"></div>\n        <pre class="pre-scrollable">{{error.data}}</pre>\n        <pre class="pre-scrollable">{{error.config}}</pre>\n      </div>\n      <table class="table table-bordered table-striped">\n        <tr>\n          <td ng-repeat="value in state.data[state.currentRow] track by $index">{{value}}</td>\n        </tr>\n      </table>\n      <button ng-show="!state.reconData[state.currentRow].candidates" class="btn btn-block btn-warning">?</button>\n      <table class="table table-bordered table-striped">\n        <tr ng-repeat="candidate in state.reconData[state.currentRow].candidates | limitTo : 29" ng-style="{\'background-color\':candidate.color}" ng-class="candidate.id==state.reconData[state.currentRow].match.id ? \'info\' : \'\'">\n          <th ng-if="$index&lt;9" ng-click="select($index)" style="cursor:pointer">{{$index+1}}</th>\n          <th ng-if="$index&gt;=9" ng-click="select($index)" style="cursor:pointer">-</th>\n          <th ng-click="select($index)" style="cursor:pointer">{{candidate.label}}</th>\n          <td ng-repeat="descr in candidate.description track by $index" ng-bind-html="$sce.trustAsHtml(descr)"></td>\n        </tr>\n      </table>\n      <button ng-show="state.reconData[state.currentRow].candidates.length==30" class="btn btn-block btn-danger">...</button>\n    </div>\n    <div class="row">\n      <div class="col-xs-12"></div>\n    </div>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/projectlist.html",'\n<div class="container">\n  <h3>Projects:</h3>\n  <div ng-repeat="project in projects" class="row">\n    <div class="col-xs-2">\n      <ul>\n        <li><a ui-sref="project({projectId:project.name})">{{project.name}}</a></li>\n      </ul>\n    </div>\n    <div class="col-xs-4">\n      <progress style="margin-bottom:0px">\n        <bar type="success" value="100 * project.counts.match / project.total">{{project.counts.match}}</bar>\n        <bar type="warning" value="100 * project.counts.nomatch / project.total">{{project.counts.nomatch}}</bar>&nbsp;{{project.total - project.counts.match - project.counts.nomatch}}\n      </progress>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-xs-12">\n      <ul>\n        <li>\n          <form ng-submit="newProject(newProjectId)" class="form-inline">\n            <input type="text" ng-model="newProjectId" class="form-control"/>\n          </form>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>')}])}();