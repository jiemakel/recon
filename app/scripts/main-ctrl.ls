angular.module("app").controller "MainCtrl", ($scope,$localStorage,$state,$stateParams,$q,sparql,hotkeys,focus) ->
  # initialization
  config = $localStorage.config
  if not config? then $state.go('config')
  $scope.config = config
  $localStorage.state ?= { currentRow : 0, currentOffset : 0, reconData : [] }
  state = $localStorage.state
  $scope.state=state
  $scope.currentPage = state.currentOffset / config.pageSize + 1
  hotkeys.add(
    combo: 'tab'
    allowIn: ['INPUT']
    callback: (event,hotkey) !->
      if state.currentRow==state.currentOffset+config.pageSize - 1
        $scope.currentPage++
        if ($scope.currentPage - 1)*config.pageSize>state.data.length then $scope.currentPage = 1
  )
  for number in [0 to 9]
    hotkeys.add(
      combo: ''+number
      allowIn: ['INPUT']
      callback: (event,hotkey) !->
        state.reconData[state.currentRow].match=state.reconData[state.currentRow].candidates[(hotkey.combo[0]-1)%10]
        if state.currentRow==state.currentOffset+config.pageSize - 1
          $scope.currentPage++
          if ($scope.currentPage - 1)*config.pageSize>state.data.length then $scope.currentPage = 1
        else focus("row"+(state.currentRow+1))
        event.preventDefault!
    )
  # support functions
  !function handleError error
    $scope.error=error
  $scope.$watch 'currentPage' (nv) !->
    if !nv? then nv = 1
    state.currentOffset = state.currentRow = (nv - 1)*config.pageSize
    focus("row"+state.currentOffset)
  $scope.loadCSVFile = (file) !->
    if (!file) then return
    Papa.parse(file, { complete: (csv) !->
      state.data=csv.data
      state.currentRow = 0
      state.currentOffset = 0
      state.reconData=[]
      findMatches([{index,text:state.data[index][0]} for index from 0 til config.pageSize])
      $scope.$digest!
    , error:handleError })
  canceller = void
  !function findMatches queries
    queryParts = config.matchQuery.split(/[\{\}] # \/?QUERY/)
    console.log(queryParts)
    queryText=queryParts[0]
    for q in queries
      queryText+="{"+queryParts[1].replaceAll(/<QUERY_ID>/,q.index).replaceAll(/<QUERY>/,q.text)+"}"
    queryText+=queryParts[2]
    if (canceller?) then canceller.resolve!
    $scope.queryRunning = true
    canceller:=$q.defer!
    response <-! sparql.query(config.sparqlEndpoint,queryText,{timeout:canceller.promise}).then(_,handleError)
    $scope.error = void
    $scope.queryRunning = false
    candidatesHashes = []
    for binding,index in response.data.results.bindings when binding.entity?
      if (!candidatesHashes[binding.index.value]) then candidatesHashes[binding.index.value] = {}
      candidatesHash = candidatesHashes[binding.index.value]
      if (!candidatesHash[binding.entity.value]) then candidatesHash[binding.entity.value] = {
        index:index
        id:binding.entity.value
        label:binding.label.value
        color:'rgb(127,'+Math.floor(127+parseFloat(binding.score.value)*127)+',127)'
        description:[]
      }
      for pname,pval of binding when pname!='index' && pname!='entity' && pname!='label' && pname!='score'
        candidatesHash[binding.entity.value].description.push(pval.value)
    for candidatesHash, index in candidatesHashes
      state.reconData{}[index].candidates= for mid,m of candidatesHash then m
      state.reconData[index].candidates.sort (a,b) -> a.index - b.index
  $scope.focus = (index) !->
    state.currentRow = index
  $scope.search = (index,text) !->
    findMatches [{text,index}]

