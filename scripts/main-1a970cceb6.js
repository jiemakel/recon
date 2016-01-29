var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=angular.module("app",["ui.router","ngStorage","ngFileUpload","ui.bootstrap","ui.bootstrap.tpls","ab-base64","http-auth-interceptor","cfp.hotkeys","focusOn","fi.seco.sparql","fi.seco.yasqe"]);e.config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/"),t.state("projectlist",{url:"/",templateUrl:"partials/projectlist.html",controller:"ProjectListController"}),t.state("project",{url:"/:projectId/",templateUrl:"partials/project.html",controller:"ProjectController"}),t.state("configure",{url:"/:projectId/configure",templateUrl:"partials/configure.html",controller:"ConfigureController"})}]),e.run(["$rootScope","$http","authService",function(t,e,n){t.authInfo={authOpen:!1,username:void 0,password:void 0},t.setAuth=function(){t.authInfo.authOpen=!1,e.defaults.headers.common.Authorization="Basic "+btoa(t.authInfo.username+":"+t.authInfo.password),n.loginConfirmed()},t.dismissAuth=function(){t.authInfo.authOpen=!1,n.loginCancelled({status:401},"Authentication required")},t.$on("event:auth-loginRequired",function(){return t.authInfo.authOpen=!0})}]),e.filter("trustAsHtml",["$sce",function(t){return function(e){return t.trustAsHtml(e)}}]);var n=function(){function t(){this.restrict="A",this.link=function(t,e,n){e.on("mouseup",function(t){t.preventDefault()}),e.on("focus",function(t){this.select()})}}return t.$inject=[],t.$componentName="selectOnFocus",t}();angular.module("app").directive("selectOnFocus",[function(){return new(Function.prototype.bind.apply(n,[null].concat(Array.prototype.slice.call(arguments))))}]),t.SelectOnFocusDirective=n}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){this.name=t,this.data=[],this.active=!1}return t}(),n=function(){function t(t,n,a,r,o,c,s,i,l,u,d){var p=this;t.projectId=r.projectId,n.projects||(n.projects={}),n.projects[r.projectId]||(n.projects[r.projectId]={config:null,state:null});var f=n.projects[r.projectId].config;if(!f)return void a.go("configure",{projectId:r.projectId});t.config=f,n.projects[r.projectId].state||(n.projects[r.projectId].state={currentRow:0,currentOffset:0,reconData:[],data:[],sparqlEndpoint:void 0,loadQuery:void 0,fileName:void 0,counts:{match:0,nomatch:0},headings:[],matchHeadings:[]});var h=n.projects[r.projectId].state;t.state=h,t.currentPage=h.currentOffset/f.pageSize+1,s.bindTo(t).add({combo:"shift+tab",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){h.currentRow===h.currentOffset&&(t.currentPage--,0===t.currentPage&&(t.currentPage=Math.floor(h.data.length/f.pageSize+1)))}}),s.bindTo(t).add({combo:"tab",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){(h.currentRow===h.currentOffset+f.pageSize-1||h.currentRow===h.data.length-1)&&(t.currentPage++,(t.currentPage-1)*f.pageSize>h.data.length&&(t.currentPage=1))}}),s.bindTo(t).add({combo:"ctrl+0",allowIn:["INPUT","TEXTAREA"],callback:function(e,n){h.reconData[h.currentRow]||(h.reconData[h.currentRow]={match:void 0,notes:"",candidates:[]}),h.reconData[h.currentRow].match&&h.counts.match--,h.counts.nomatch++,h.reconData[h.currentRow].match=null,h.currentRow===h.currentOffset+f.pageSize-1?(t.currentPage++,(t.currentPage-1)*f.pageSize>h.data.length&&(t.currentPage=1)):u("row"+(h.currentRow+1)),e.preventDefault()}});for(var g=1;10>g;g++)s.bindTo(t).add({combo:"ctrl+"+g,allowIn:["INPUT","TEXTAREA"],callback:function(e,n){h.reconData[h.currentRow].match||(h.counts.match++,null===h.reconData[h.currentRow].match&&h.counts.nomatch--),h.reconData[h.currentRow].match=h.reconData[h.currentRow].candidates[parseInt(n.combo[0].substr(5),10)-1],h.currentRow===h.currentOffset+f.pageSize-1?(t.currentPage++,(t.currentPage-1)*f.pageSize>h.data.length&&(t.currentPage=1)):u("row"+(h.currentRow+1)),e.preventDefault()}});var b=function(e){return t.error=e},m=!1,v=function(e){if(e=e.filter(function(t){return""!==t.text}),0!==e.length){var n=f.matchQuery.split(/[\{\}] # \/?QUERY/),a=n[0];e.forEach(function(t){var e=n[1].replace(/<QUERY_ID>/g,""+t.index).replace(/<QUERY>/g,c.stringToSPARQLString(t.text));h.data[t.index].forEach(function(t,n){e=e.replace(new RegExp("<CELL_"+n+">","g"),c.stringToSPARQLString(t))}),a+="{"+e+"} UNION"}),a=a.substring(0,a.length-6)+n[2],p.canceler.resolve(),t.queryRunning=!0,p.canceler=o.defer(),c.query(f.sparqlEndpoint,a,{timeout:p.canceler.promise}).then(function(n){e.length>1&&(m=!1),e.forEach(function(t){h.reconData[t.index]&&delete h.reconData[t.index].candidates}),t.error=void 0,t.queryRunning=!1,h.matchHeadings=n.data.head.vars.filter(function(t){return"queryId"!==t&&"entity"!==t&&"label"!==t&&"score"!==t});var a={};n.data.results.bindings.filter(function(t){return t.entity?!0:!1}).forEach(function(t,e){a[t.queryId.value]||(a[t.queryId.value]={});var r=a[t.queryId.value];r[t.entity.value]||(r[t.entity.value]={index:e,id:t.entity.value,label:t.label.value,color:"rgb(127,"+Math.floor(127+127*parseFloat(t.score.value))+",127)",description:[]}),n.data.head.vars.filter(function(t){return"queryId"!==t&&"entity"!==t&&"label"!==t&&"score"!==t}).forEach(function(e){return r[t.entity.value].description.push(t[e]?t[e].value:"")})});for(var r in a){h.reconData[r]||(h.reconData[r]={match:void 0,notes:"",candidates:[]});var o=[];for(var c in a[r])o.push(a[r][c]);o.sort(function(t,e){return t.index-e.index}),h.reconData[r].candidates=o}},function(t){e.length>1?(m=!0,v([{text:h.data[h.currentRow][0],index:h.currentRow}])):b(t)})}};t.$watch("currentPage",function(e,n){e||(e=n=1),h.currentOffset=(e-1)*f.pageSize,e===n-1?h.currentRow=h.currentOffset+f.pageSize-1:1===n&&e===Math.floor(h.data.length/f.pageSize+1)?h.currentRow=h.data.length-1:h.currentRow=h.currentOffset,t.reviewing||u("row"+h.currentRow);var a=[],r=h.currentOffset+f.pageSize;r>h.data.length&&(r=h.data.length);for(var o=h.currentOffset;r>o;o++)h.reconData[o]||a.push({index:o,text:h.data[o][0]});v(a)}),this.canceler=o.defer(),t.$watch("state.sparqlEndpoint",function(e,n){e&&(p.canceler.resolve(),p.canceler=o.defer(),c.check(e,{timeout:p.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))}),t.loadSPARQL=function(){p.canceler.resolve(),p.canceler=o.defer(),c.query(h.sparqlEndpoint,h.loadQuery,{timeout:p.canceler.promise}).then(function(e){var n={},a=e.data.head.vars[0];e.data.results.bindings.filter(function(t){return t[a]?!0:!1}).forEach(function(t){var r=t[a].value;n[r]||(n[r]={}),e.data.head.vars.forEach(function(e){t[e]&&(n[r][e]||(n[r][e]={}),n[r][e][t[e].value]=!0)})}),h.data=[];for(var r in n){var o=[];e.data.head.vars.forEach(function(t){var e="";for(var a in n[r][t])e+=a+", ";o.push(e.substr(0,e.length-2))}),o.splice(1,0,r),h.data.push(o)}h.currentRow=0,h.currentOffset=0,t.currentPage=1,h.reconData=[];var c=[],s=h.currentOffset+f.pageSize;s>h.data.length&&(s=h.data.length);for(var i=h.currentOffset;s>i;i++)h.reconData[i]||c.push({index:i,text:h.data[i][0]});v(c)},b)},t.openSPARQL=function(){i.open({templateUrl:"loadSPARQL",scope:t,size:"lg"})},t.saveCSVFile=function(){var t=[],e=h.headings.slice();e.splice(1,0,"Match","Notes"),t.push(e),h.data.forEach(function(e,n){var a=e.slice();h.reconData[n]?h.reconData[n].match?a.splice(1,0,h.reconData[n].match.id,h.reconData[n].notes):a.splice(1,0,void 0,h.reconData[n].notes):a.splice(1,0,void 0,void 0),t.push(a)}),saveAs(new Blob([Papa.unparse(t)],{type:"text/csv"}),"reconciled-"+h.fileName+(-1!==h.fileName.indexOf(".csv",h.fileName.length-4)?"":".csv"))};var w=function(e){h.headings=e[0].map(function(e,n){return t.firstRowIsHeader?e:"Column "+n}),h.data=e,h.data.splice(0,(t.skipRows?t.skipRows:0)+(t.firstRowIsHeader?1:0)),h.currentRow=0,h.currentOffset=0,h.counts={match:0,nomatch:0},t.currentPage=1,h.reconData=[];var n=[],a=h.currentOffset+f.pageSize;a>h.data.length&&(a=h.data.length);for(var r=h.currentOffset;a>r;r++)h.reconData[r]||n.push({index:r,text:h.data[r][0]});v(n)};t.loadSheet=function(){t.sheets.filter(function(t){return t.active}).forEach(function(t){return w(t.data)})},t.loadFile=function(n){if(n)if(h.fileName=n.name,"text/csv"===n.type)Papa.parse(n,{complete:function(n){0!==n.errors.length?b({data:n.errors.map(function(t){return t.message}).join("\n")}):(t.sheets=[new e("Table")],t.firstRowIsHeader=!0,t.sheets[0].data=n.data,t.sheets[0].active=!0,i.open({templateUrl:"selectSheet",scope:t,size:"lg"}))},error:function(t){return b({data:t.message})}});else{var a=new FileReader;a.onload=function(){var n=XLSX.read(a.result,{type:"binary"});t.sheets=[],n.SheetNames.forEach(function(a){var r=new e(a),o=XLSX.utils.sheet_to_json(n.Sheets[a]);r.data=[[]];for(var c in o[0])c.startsWith("__")||r.data[0].push(c);XLSX.utils.sheet_to_json(n.Sheets[a]).forEach(function(t){var e=[];r.data[0].forEach(function(n){return e.push(t[n])}),r.data.push(e)}),t.sheets.push(r)}),t.firstRowIsHeader=!0,t.sheets[0].active=!0,i.open({templateUrl:"selectSheet",scope:t,size:"lg"})},a.readAsBinaryString(n)}},t.deselect=function(){h.reconData[h.currentRow].match&&h.counts.match--,h.counts.nomatch++,h.reconData[h.currentRow].match=null,h.currentRow===h.currentOffset+f.pageSize-1?(t.currentPage++,(t.currentPage-1)*f.pageSize>h.data.length&&(t.currentPage=1)):u("row"+(h.currentRow+1))},t.select=function(e){h.reconData[h.currentRow].match||(h.counts.match++,null===h.reconData[h.currentRow].match&&h.counts.nomatch--),h.reconData[h.currentRow].match=h.reconData[h.currentRow].candidates[e],h.currentRow===h.currentOffset+f.pageSize-1?(t.currentPage++,(t.currentPage-1)*f.pageSize>h.data.length&&(t.currentPage=1)):u("row"+(h.currentRow+1))},t.focus=function(e,n){t.reviewing=!1,h.currentRow=e,!m||h.reconData[e]&&h.reconData[e].candidates&&0!==h.reconData[e].candidates.length||v([{text:n,index:e}])},t.search=function(t,e){return v([{text:e,index:t}])}}return t.$inject=["$scope","$localStorage","$state","$stateParams","$q","sparqlService","hotkeys","$uibModal","$sce","focus","base64"],t.$componentName="ProjectController",t}();angular.module("app").controller("ProjectController",n),t.ProjectController=n}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,n){this.name=t,this.total=e,this.counts=n}return t}(),n=function(){function t(t,n,a){a.projects||(a.projects={}),t.projects=[];for(var r in a.projects)t.projects.push(new e(r,a.projects[r].state.data.length,a.projects[r].state.counts));t.newProject=function(t){n.go("project",{projectId:t})}}return t.$inject=["$scope","$state","$localStorage"],t.$componentName="ProjectListController",t}();angular.module("app").controller("ProjectListController",n),t.ProjectListController=n}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={}));var fi;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,n,a,r,o,c){var s=this;t.projectId=n.projectId,e.projects[n.projectId].config||(e.projects[n.projectId].config={sparqlEndpoint:"http://",pageSize:15,matchQuery:"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nSELECT ?queryId ?entity ?label ?score {\n  { # QUERY\n    {\n      SELECT ?entity {\n        BIND(<QUERY> AS ?label)\n        ?entity rdfs:label|skos:prefLabel ?label .\n      }\n      LIMIT 30\n    }\n    BIND(1.0 AS ?score)\n    BIND(<CELL_1> AS ?cell1)\n    BIND(<QUERY_ID> AS ?queryId)\n  } # /QUERY\n  ?entity rdfs:label|skos:prefLabel ?label .\n}"}),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,this.canceler=r.defer(),t.importProject=function(a){if(a){var r=new FileReader;r.onload=function(){e.projects[n.projectId]=JSON.parse(r.result),t.config=e.projects[n.projectId].config,t.state=e.projects[n.projectId].state,t.$digest()},r.readAsText(a)}},t.deleteProject=function(){delete e.projects[n.projectId],a.go("projectlist")},t.exportProject=function(){saveAs(new Blob([JSON.stringify(e.projects[n.projectId])],{type:"application/json"}),n.projectId+".json")},t.deleteData=function(){e.projects[n.projectId].state=null,t.state=null},t.$watch("config.sparqlEndpoint",function(e,n){e&&(s.canceler.resolve(),s.canceler=r.defer(),o.check(e,{timeout:s.canceler.promise}).then(function(e){return t.sparqlEndpointOK=e}))})}return t.$inject=["$scope","$localStorage","$stateParams","$state","$q","sparqlService","base64"],t.$componentName="ConfigureController",t}();angular.module("app").controller("ConfigureController",e),t.ConfigureController=e}(e=t.recon||(t.recon={}))}(e=t.seco||(t.seco={}))}(fi||(fi={})),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/configure.html",'\n<div class="container">\n  <div ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'" class="form-group">\n    <label>SPARQL endpoint</label>\n    <input type="text" ng-model="config.sparqlEndpoint" class="form-control"/>\n  </div>\n  <div class="form-group">\n    <label>Match and short description query</label>\n    <yasqe data="config.matchQuery"></yasqe>\n  </div>\n  <div class="form-group">\n    <label>Entries per page</label>\n    <input type="number" ng-model="config.pageSize" class="form-control"/>\n  </div>\n  <div class="form-group">\n    <button ui-sref="project({projectId:projectId})" class="btn btn-success">Return to project</button>\n  </div>\n  <div class="form-group">\n    <button ngf-select="ngf-select" ngf-change="importProject($files[0])" ngf-multiple="false" class="btn btn-warning">Import project</button>\n    <button ng-click="exportProject()" class="btn btn-warning">Export project</button>\n  </div>\n  <div class="form-group">\n    <button ng-click="deleteData()" ng-show="state.data.length&gt;0" class="btn btn-danger">Delete project data ({{state.data.length}} rows)</button>\n    <button ng-click="deleteProject()" class="btn btn-danger">Delete project</button>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/project.html",'\n<script type="text/ng-template" id="selectSheet">\n  <div class="modal-header">\n    <h3 class="modal-title">Preview</h3>\n  </div>\n  <div class="modal-body">\n    <uib-tabset>\n      <uib-tab ng-repeat="sheet in sheets" heading="{{sheet.name}}" active="sheet.active">\n        <div style="overflow:scroll;max-height:500px">\n          <table class="table table-bordered table-striped">\n            <tr> \n              <th ng-if="firstRowIsHeader" ng-repeat="header in sheet.data[0] track by $index">{{header}}</th>\n              <th ng-if="!firstRowIsHeader" ng-repeat="header in sheet.data[0] track by $index">Column {{$index}}</th>\n            </tr>\n            <tr ng-repeat="row in sheet.data | limitTo:10:(skipRows+(firstRowIsHeader ? 1 : 0)) track by $index">\n              <td ng-repeat="column in row track by $index">{{column}}</td>\n            </tr>\n          </table>\n        </div>\n      </uib-tab>\n    </uib-tabset>\n  </div>\n  <div class="modal-footer">\n    <div class="checkbox">\n      <label>\n        <input type="checkbox" ng-model="$parent.firstRowIsHeader"/>Use first row as header\n      </label>\n    </div>\n    <input type="number" ng-model="$parent.skipRows" placeholder="skip rows"/>\n    <button ng-click="$close();loadSheet()" class="btn btn-success">Load</button>\n  </div>\n</script>\n<script type="text/ng-template" id="loadSPARQL">\n  <div class="modal-header">\n    <h3 class="modal-title">Load from a SPARQL endpoint</h3>\n  </div>\n  <div class="modal-body">\n    <div ng-class="sparqlEndpointOK ? \'has-success\' : \'has-error\'" class="form-group">\n      <label>SPARQL endpoint</label>\n      <input type="text" ng-model="state.sparqlEndpoint" class="form-control"/>\n    </div>\n    <div class="form-group">\n      <label>Load query</label>\n      <yasqe data="state.loadQuery"></yasqe>\n      <yasr></yasr>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button ng-click="$close();loadSPARQL()" class="btn btn-success">Ok    </button>\n  </div>\n</script>\n<div style="max-width:97%" class="container-fluid">\n  <div class="row">\n    <div ng-class="reviewing ? \'col-xs-12\' : \'col-xs-3\'">\n      <table class="table table-bordered table-striped">\n        <tr ng-if="reviewing">\n          <th>Name</th>\n          <th ng-repeat="header in state.headings track by $index">{{header}}</th>\n          <th>Match</th>\n          <th>Notes</th>\n          <th ng-repeat="header in state.matchHeadings track by $index">{{header}}</th>\n        </tr>\n        <tr ng-repeat="row in state.data | limitTo : config.pageSize : state.currentOffset">\n          <td ng-class="state.reconData[state.currentOffset + $index].match ? \'has-success\' : (state.reconData[state.currentOffset + $index].match === null ? \'has-warning\' : \'has-error\')">\n            <input tooltip-placement="right" uib-tooltip="{{state.reconData[state.currentOffset + $index].match.id ? state.reconData[state.currentOffset + $index].match.label + \' (\' + state.reconData[state.currentOffset + $index].match.id + \')\' : \'\'}}" select-on-focus="select-on-focus" focus-on="row{{state.currentOffset + $index}}" type="text" ng-init="input=row[0]" ng-model="input" ng-model-options="{debounce: 300}" ng-focus="focus(state.currentOffset + $index,input)" ng-change="search(state.currentOffset + $index,input)" class="form-control"/><span ng-if="reviewing" style="visibility:hidden;white-space:nowrap">{{row[0]}}</span>\n          </td>\n          <td ng-if="reviewing" ng-repeat="value in row | limitTo:100:1 track by $index ">{{value}}</td>\n          <td ng-if="reviewing" ng-class="state.reconData[state.currentOffset + $index].match ? \'info\' : (state.reconData[state.currentOffset + $index].match === null ? \'warning\' : \'danger\')">{{state.reconData[state.currentOffset + $index].match.id ? state.reconData[state.currentOffset + $index].match.label + \' (\' + state.reconData[state.currentOffset + $index].match.id + \')\' : ( state.reconData[state.currentOffset + $index].match === null ? \'none\' : \'not processed\')}}</td>\n          <td ng-if="reviewing" style="white-space: pre-line">{{state.reconData[state.currentOffset + $index].notes}}</td>\n          <td ng-if="reviewing" ng-repeat="descr in state.reconData[state.currentOffset + $index].match.description track by $index" ng-bind-html="descr | trustAsHtml" class="info"></td>\n        </tr>\n      </table>\n      <uib-pagination ng-model="currentPage" items-per-page="config.pageSize" max-size="4" total-items="state.data.length" boundary-links="true" previous-text="‹" next-text="›" first-text="«" last-text="»" class="pagination-sm"></uib-pagination>\n      <uib-progress>\n        <uib-bar type="success" value="100 * state.counts.match / state.data.length">{{state.counts.match}}</uib-bar>\n        <uib-bar type="warning" value="100 * state.counts.nomatch / state.data.length">{{state.counts.nomatch}}</uib-bar>&nbsp;{{state.data.length - state.counts.match - state.counts.nomatch}}\n      </uib-progress>\n      <div class="clearfix">\n        <button ng-click="reviewing=!reviewing" class="btn btn-success">Review</button>\n        <button ngf-select="ngf-select" ngf-change="loadFile($files[0])" ngf-multiple="false" class="btn btn-success">Load File</button>\n        <button ng-click="openSPARQL()" class="btn btn-success">Load SPARQL</button>\n        <button ng-click="saveCSVFile()" ng-show="state.data.length&gt;0" class="btn btn-warning">Export CSV</button>\n        <button ui-sref="configure({projectId:projectId})" class="btn btn-default">Configure</button>\n      </div>\n    </div>\n    <div style="max-height:95vh;overflow-y:auto" ng-if="!reviewing" class="col-xs-9"><i ng-show="queryRunning &amp;&amp; !error" class="fa fa-spinner fa-spin"></i>\n      <div ng-show="error">\n        <h4>{{error.status}}\n          <button ng-click="error=\'\';queryRunning=false" class="pull-right btn btn-xs btn-danger">X</button>\n        </h4>\n        <div class="clearfix"></div>\n        <pre class="pre-scrollable">{{error.data}}</pre>\n        <pre class="pre-scrollable">{{error.config}}</pre>\n      </div>\n      <table class="table table-bordered table-striped">\n        <tr>\n          <th ng-repeat="header in state.headings track by $index">{{header}}</th>\n        </tr>\n        <tr>\n          <td ng-repeat="value in state.data[state.currentRow] track by $index">{{value}}</td>\n        </tr>\n      </table>\n      <div class="form-group">\n        <label>Notes</label>\n        <textarea ng-model="state.reconData[state.currentRow].notes" class="form-control"></textarea>\n      </div>\n      <button ng-show="!state.reconData[state.currentRow].candidates" class="btn btn-block btn-warning">?</button>\n      <table class="table table-bordered table-striped">\n        <tr>\n          <th></th>\n          <th>Match</th>\n          <th ng-repeat="header in state.matchHeadings track by $index">{{header}}</th>\n        </tr>\n        <tr ng-class="state.reconData[state.currentRow].match === null ? \'info\' : \'warning\'">\n          <th>0</th>\n          <th ng-click="deselect()" style="cursor:pointer">None of the below</th>\n          <td ng-repeat="descr in state.reconData[state.currentRow].candidates[0].description track by $index"></td>\n        </tr>\n        <tr ng-repeat="candidate in state.reconData[state.currentRow].candidates | limitTo : 29" ng-style="{\'background-color\':candidate.color}" ng-class="candidate.id==state.reconData[state.currentRow].match.id ? \'info\' : \'\'">\n          <th ng-if="$index&lt;9" ng-click="select($index)" style="cursor:pointer">{{$index+1}}</th>\n          <th ng-if="$index&gt;=9" ng-click="select($index)" style="cursor:pointer">-</th>\n          <th ng-click="select($index)" style="cursor:pointer">{{candidate.label}}</th>\n          <td ng-repeat="descr in candidate.description track by $index" ng-bind-html="descr | trustAsHtml"></td>\n        </tr>\n      </table>\n      <button ng-show="state.reconData[state.currentRow].candidates.length==30" class="btn btn-block btn-danger">...</button>\n    </div>\n    <div class="row">\n      <div class="col-xs-12"></div>\n    </div>\n  </div>\n</div>')}])}(),function(t){try{t=angular.module("app")}catch(e){t=angular.module("app",[])}t.run(["$templateCache",function(t){t.put("partials/projectlist.html",'\n<div class="container">\n  <h3>Projects:</h3>\n  <div ng-repeat="project in projects" class="row">\n    <div class="col-xs-2">\n      <ul>\n        <li><a ui-sref="project({projectId:project.name})">{{project.name}}</a></li>\n      </ul>\n    </div>\n    <div class="col-xs-4">\n      <uib-progress style="margin-bottom:0px">\n        <uib-bar type="success" value="100 * project.counts.match / project.total">{{project.counts.match}}</uib-bar>\n        <uib-bar type="warning" value="100 * project.counts.nomatch / project.total">{{project.counts.nomatch}}</uib-bar>&nbsp;{{project.total - project.counts.match - project.counts.nomatch}}\n      </uib-progress>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-xs-12">\n      <ul>\n        <li>\n          <form ng-submit="newProject(newProjectId)" class="form-inline">\n            <input type="text" ng-model="newProjectId" class="form-control"/>\n          </form>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>')}])}();