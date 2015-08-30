module app {

  export interface ISparqlBinding {
    type : string,
    value : string,
    "xml:lang"? : string,
    datatype? : string
  }

  export interface ISparqlBindingResult {
    head: {
      vars : string[],
      link? : string[]
    },
    results : {
      bindings : {[key : string] : ISparqlBinding}[]
    }
  }

  export interface ISparqlAskResult {
    boolean : boolean
  }

  export class SparqlService {
    constructor(private $http : angular.IHttpService, private $q : angular.IQService) {}
    check(endpoint : string,params?: {}) : angular.IPromise<boolean> {
      var deferred = this.$q.defer()
      this.$http(angular.extend({
        method: "GET",
        url : endpoint,
        params: { query:"ASK {}" },
        headers: { 'Accept' : 'application/sparql-results+json' }
      },params)).then(
        (response : angular.IHttpPromiseCallbackArg<ISparqlAskResult>) => deferred.resolve(response.data.boolean === true)
      , (response : angular.IHttpPromiseCallbackArg<string>) => deferred.resolve(false)
      )
      return deferred.promise;
    }
    checkUpdate(endpoint : string,params?: {}) : angular.IPromise<boolean> {
      var deferred = this.$q.defer()
      this.$http(angular.extend({
        method: "POST",
        url: endpoint,
        headers: { 'Content-Type' : 'application/sparql-update' },
        data: "INSERT DATA {}"
      },params)).then(
        (response : angular.IHttpPromiseCallbackArg<string>) => deferred.resolve(response.status === 204)
      , (response : angular.IHttpPromiseCallbackArg<string>) => deferred.resolve(false)
      )
      return deferred.promise;
    }
    checkRest(endpoint : string,params?: {}) : angular.IPromise<boolean> {
      var deferred = this.$q.defer()
      this.$http(angular.extend({
        method: "POST",
        url : endpoint + "?default",
        data : "",
        headers: { 'Content-Type' : 'text/turtle' }
      },params)).then(
        (response : angular.IHttpPromiseCallbackArg<string>) => deferred.resolve(response.status === 204)
      , (response : angular.IHttpPromiseCallbackArg<string>) => deferred.resolve(false)
      )
      return deferred.promise;
    }
    get(endpoint:string,graphIRI? : string,params? : {}) : angular.IHttpPromise<string> {
      return this.$http(angular.extend({
        method: "GET",
        url : endpoint,
        params: graphIRI!=null ? { graph:graphIRI } : {"default":""},
        headers: { 'Accept' : 'text/turtle' }
        },params))
    }
    post(endpoint:string,graph:string,graphIRI? : string,params? : {}) : angular.IHttpPromise<string> {
      return this.$http(angular.extend({
        method: "POST",
        url : endpoint,
        params: graphIRI!=null ? { graph:graphIRI } : {"default":""},
        data: graph,
        headers: { 'Content-Type' : 'text/turtle' }
      },params))
    }
    put(endpoint:string,graph:string,graphIRI? : string,params? : {}) : angular.IHttpPromise<string> {
      return this.$http(angular.extend({
        method: "PUT",
        url : endpoint,
        params: graphIRI!=null ? { graph:graphIRI } : {"default":""},
        data: graph,
        headers: { 'Content-Type' : 'text/turtle' }
      },params))
    }
    delete(endpoint:string,graphIRI:string,params?: {}) : angular.IHttpPromise<string> {
      return this.$http(angular.extend({
          method: "DELETE",
          url : endpoint,
          params: graphIRI!=null ? { graph:graphIRI } : {"default":""}
      },params))
    }
    query<T>(endpoint : string,query : string,params?: {}) : angular.IHttpPromise<ISparqlBindingResult> {
      if (query.length<=2048)
        return this.$http(angular.extend({
          method: "GET",
          url : endpoint,
          params: { query:query },
          headers: { 'Accept' : 'application/sparql-results+json' }
        },params));
      else
        return this.$http(angular.extend({
          method: "POST",
          url : endpoint,
          data: query,
          headers: {
            'Content-Type': 'application/sparql-query',
            'Accept' : 'application/sparql-results+json'
          }
        },params));
    }
    construct(endpoint:string,query:string,params?: {}) {
      if (query.length<=2048)
        return this.$http(angular.extend({
          method: "GET",
          url : endpoint,
          params: { query:query },
          headers: { 'Accept' : 'text/turtle' }
        },params))
      else
        return this.$http(angular.extend({
          method: "POST",
          url : endpoint,
          data: query,
          headers: {
            'Content-Type': 'application/sparql-query',
            'Accept' : 'text/turtle'
          }
        },params))
    }
    update(endpoint,query,params) {
      return this.$http(angular.extend({
        method: "POST",
        url: endpoint,
        headers: { 'Content-Type' : 'application/sparql-update' },
        data: query
      },params))
    }
    stringToSPARQLString(string) : string {
      return "'"+string.replace(/'/g,"\\'")+"'"
    }
    bindingToString(binding : ISparqlBinding) : string {
      if (binding==null) return "UNDEF"
      else {
        var value = binding.value.replace(/\\/g,'\\\\').replace(/\t/g,'\\t').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/[\b]/g,'\\b').replace(/\f/g,'\\f').replace(/\'/g,"\\'").replace(/\"/g,'\\"')
        if (binding.type == 'uri') return '<' + value + '>'
        else if (binding.type == 'bnode') return '_:' + value
        else if (binding.datatype!=null) switch (binding.datatype) {
          case 'http://www.w3.org/2001/XMLSchema#integer':
          case 'http://www.w3.org/2001/XMLSchema#decimal':
          case 'http://www.w3.org/2001/XMLSchema#double':
          case 'http://www.w3.org/2001/XMLSchema#boolean': return value
          case 'http://www.w3.org/2001/XMLSchema#string': return '"' + value + '"'
          default: return '"' + value + '"^^<'+binding.datatype+'>'
        }
        else if (binding['xml:lang']) return '"' + value + '"@' + binding['xml:lang']
        else return '"' + value + '"'
      }
    }
  }
}
