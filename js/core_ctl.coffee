this.StorageCtl = ($scope, $rootScope, $location, $resource, OwnedProject) ->
  $scope.location    = $location
  $scope.sheets      = storage.data.sheets
  $scope.newSheet    = (name)  -> storage.data.sheets.push {name: name, items:[]}
  $scope.removeSheet = (sheet) -> 
    rfa storage.data.sheets, sheet
    if sheet.items is storage.active
      a = storage.data.active - 1
      a++ if a < 0
      if a >= storage.data.sheets.length
        storage.data.active = null    
        storage.active = null
      else
        storage.data.active = a
        storage.active = storage.data.sheets[a]
  $scope.isSel       = (sheet) -> sheet.items is storage.active
  $scope.select      = (sheet) -> 
  	storage.active = sheet.items
  	$rootScope.ctl.update()
  $scope.clear = (name) ->
  	storage.data.sheets.length = 0
  	$scope.newSheet name
  	storage.active = storage.data.sheets[0].items
  	$rootScope.ctl.update()
  $scope.import = -> imp()
  $scope.save   = (name) ->
    json = storage.getJSON()
    OwnedProject.update {owner: $rootScope.user.name, name: name}, {data: json}
  $scope.load   = (owner, project) ->
    json = OwnedProject.get {owner: owner, name: project}, ->
      storage.putJSON json.item.data
      $scope.sheets = storage.data.sheets
      $rootScope.ctl.update()
  rp = $scope.$routeParams
  if rp.user isnt 'guest' && rp.project isnt 'Новый'
    $scope.load rp.user, rp.project
  else

    
this.CoreCtl = ($scope, $rootScope) ->
  view = new View canvas, fast
  view.seq.push view.clear
  ctl = new Controller view, window
  editor = new Editor storage, view, ctl
  if Navi?
    Navi view, ctl
  if Grid?
    view.grid = new Grid view, editor
    view.seq.push view.grid.draw;
  view.seq.push editor.draw
  window.onresize()
  $rootScope.ctl = ctl
  $rootScope.storage = storage
  PnL    storage, ctl, editor, view if PnL?
  Arcs   storage, ctl, editor, view if Arcs?
  Arrows storage, ctl, editor, view if Arrows?
  Blocks storage, ctl, editor, view if Blocks?
  Menu ui, byId 'params'
  ui.makeMenu 'project', 'edit', 'view', 'create'
