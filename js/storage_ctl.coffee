StorageCtl = ($scope, $location) ->
  $scope.location    = $location
  $scope.sheets      = storage.data.sheets
  $scope.newSheet    = (name)  -> storage.data.sheets.push {name: name, items:[]}
  $scope.removeSheet = (sheet) -> rfa storage.data.sheets, sheet
  $scope.isSel       = (sheet) -> sheet.items is storage.active
  $scope.select      = (sheet) -> 
  	storage.active = sheet.items
  	ctl.update()
  $scope.clear = (name) ->
  	storage.data.sheets.length = 0
  	$scope.newSheet name
  	storage.active = storage.data.sheets[0].items
  	ctl.update()
  $scope.import = -> imp()
  $scope.save   = (name) ->
    json = storage.getJSON()
    
