angular.module("app").controller "MainCtrl", ($scope,$localStorage,$state,$stateParams,$q,sparql,hotkeys,focus,base64) ->
  # initialization
  if ($stateParams.config) then $localStorage.config = JSON.parse(base64.urldecode($stateParams.config))
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
  hotkeys.add(
    combo: '0'
    allowIn: ['INPUT']
    callback: (event,hotkey) !->
      state.reconData[state.currentRow].match=void
      if state.currentRow==state.currentOffset+config.pageSize - 1
        $scope.currentPage++
        if ($scope.currentPage - 1)*config.pageSize>state.data.length then $scope.currentPage = 1
      else focus("row"+(state.currentRow+1))
      event.preventDefault!
  )
  for number in [1 to 9]
    hotkeys.add(
      combo: ''+number
      allowIn: ['INPUT']
      callback: (event,hotkey) !->
        state.reconData[state.currentRow].match=state.reconData[state.currentRow].candidates[(hotkey.combo[0]-1)]
        if state.currentRow==state.currentOffset+config.pageSize - 1
          $scope.currentPage++
          if ($scope.currentPage - 1)*config.pageSize>state.data.length then $scope.currentPage = 1
        else focus("row"+(state.currentRow+1))
        event.preventDefault!
    )
  # support functions
  !function handleError error
    $scope.error=error
  $scope.$watch 'currentPage' (nv,ov) !->
    if !nv? then nv = ov = 1
    state.currentOffset = state.currentRow = (nv - 1)*config.pageSize
    focus("row"+state.currentOffset)
    if (nv!=ov) then findMatches [{index,text:state.data[index][0]} for index from state.currentOffset til state.currentOffset+config.pageSize when !state.reconData[index]?]
  $scope.saveCSVFile = !->
    data = []
    for row,index in state.data
      nrow = row.slice!
      nrow.splice(1,0,state.reconData[index]?.match?.id)
      data.push(nrow)
    csv = Papa.unparse(data)
    saveAs(new Blob([csv], {type : 'text/csv'}),"reconciled-"+state.fileName)
  $scope.loadCSVFile = (file) !->
    if (!file) then return
    state.fileName=file.name
    Papa.parse(file, { complete: (csv) !->
      state.data=csv.data
      state.currentRow = 0
      state.currentOffset = 0
      $scope.currentPage = 1
      state.reconData=[]
      findMatches([{index,text:state.data[index][0]} for index from 0 til config.pageSize])
      $scope.$digest!
    , error:handleError })
  canceller = void
  !function findMatches queries
    if (queries.length==0) then return
    queryParts = config.matchQuery.split(/[\{\}] # \/?QUERY/)
    queryText=queryParts[0]
    for q in queries
      queryText+="{"+queryParts[1].replace(/<QUERY_ID>/g,q.index).replace(/<QUERY>/g,sparql.stringToSPARQLString(q.text))+"} UNION"
    queryText=queryText.substring(0,queryText.length-6)+queryParts[2]
    if (canceller?) then canceller.resolve!
    $scope.queryRunning = true
    canceller:=$q.defer!
    response <-! sparql.query(config.sparqlEndpoint,queryText,{timeout:canceller.promise}).then(_,handleError)
    $scope.error = void
    $scope.queryRunning = false
    candidatesHashes = {}
    for binding,index in response.data.results.bindings when binding.entity?
      if (!candidatesHashes[binding.queryId.value]) then candidatesHashes[binding.queryId.value] = {}
      candidatesHash = candidatesHashes[binding.queryId.value]
      if (!candidatesHash[binding.entity.value]) then candidatesHash[binding.entity.value] = {
        index:index
        id:binding.entity.value
        label:binding.label.value
        color:'rgb(127,'+Math.floor(127+parseFloat(binding.score.value)*127)+',127)'
        description:[]
      }
      for pname,pval of binding when pname!='queryId' && pname!='entity' && pname!='label' && pname!='score'
        candidatesHash[binding.entity.value].description.push(pval.value)
    for index, candidatesHash of candidatesHashes
      state.reconData{}[index].candidates= [ m for mid,m of candidatesHash ]
      state.reconData[index].candidates.sort (a,b) -> a.index - b.index
  $scope.focus = (index) !->
    state.currentRow = index
  $scope.search = (index,text) !->
    findMatches [{text,index}]

