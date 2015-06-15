angular.module("app").controller "MainCtrl", ($scope,$localStorage,$state,$stateParams,$q,sparql,hotkeys,focus) ->
  # initialization
  config = $localStorage.config
  $scope.config = config
  $localStorage.state ?= { currentRow : 0, currentPage : 1}
  state = $localStorage.state
  $scope.state=state
  for number in [0 to 9]
    hotkeys.add(
      combo: ''+number
      allowIn: ['INPUT']
      callback: (event,hotkey) !->
        cdata = state.data[state.currentRow]
        cdata.match=cdata.candidates[(hotkey.combo[0]-1)%10]
        focus("row"+(state.currentRow+1))
        event.preventDefault!
    )
  # support functions
  !function handleError error
    $scope.error=error
  $scope.loadCSVFile = (file) !->
    if (!file) then return
    Papa.parse(file, { complete: (csv) !->
      state.data=csv.data
      state.currentPage = 1
      state.currentRow = 0
      $scope.$digest!
    , error:handleError })
  canceller = void
  !function findMatches queries
    queryText = ""
    for q in queries then queryText+="(#{q.index} '#{sparql.stringToSPARQLString(q.text)}')"
    if (canceller?) then canceller.resolve!
    $scope.queryRunning = true
    canceller:=$q.defer!
    response <-! sparql.query(config.sparqlEndpoint,config.matchQuery.replace(/\(<QUERIES>\)/g,queries,{timeout:canceller.promise})).then(_,handleError)
    $scope.error = void
    $scope.queryRunning = false
    candidatesHashes = []
    for binding,index in response.data.results.bindings when binding.entity?
      if (!candidatesHashes[binding.index.value]) then candidatesHashes[binding.index.value] = {}
      candidatesHash = candidatesHashes[binding.index.value]
      if (!candidatesHash[binding.entity.value]) then candidatesHash[binding.entity.value] = {
        id:binding.entity.value
        label:binding.label.value
        color:'rgb(127,'+Math.floor(127+parseFloat(binding.score.value)*127)+',127)'
        description:[]
      }
      for pname,pval of binding when pname!='index' && pname!='entity' && pname!='label' && pname!='score'
        candidatesHash[binding.entity.value].description.push(pval.value)
    for candidateHash, index in candidatesHashes
      state.data[index].candidates= for mid,m of candidatesHash then m
      state.data[index].candidates.sort (a,b) -> a.index - b.index
  $scope.focus = (index) !->
    $scope.currentRow = index
  $scope.search = (index,text) !->
    findMatches {text,index}

