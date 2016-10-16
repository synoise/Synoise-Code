
$scope.searchVechicelsInAadmin = [];

$scope.setEngineFilter = function (filtr, item) {
    $scope[filtr] = item;
}


$scope.removeItem = function removeItem(row) {
    var index = $scope.vehicles.indexOf(row);
    if (index !== -1) {
        $scope.vehicles.splice(index, 1);
    }
}


$scope.removeItemEngines = function removeItem(row, row_0) {
    alert(row + row_0)
    var index = $scope.engines_all["F31"].indexOf(row);
    if (index !== -1) {
        $scope.engines["F31"].splice(index, 1);
    }
};

$scope.reloadEngines = function reloadEngines() {
    alert(1)
    $scope.model1admin='block';
    $scope.engineURL = "engine3.html";
    $scope.loadJSONtoScope("./json/engines.json", "F30", "F30");
}

$scope.addRecord = function () {
    $scope.vehicles.push({
        "model_id": $scope.addingItem.model_id,
        "mark": $scope.addingItem.mark,
        "name": $scope.addingItem.name,
        "car_type": $scope.addingItem.car_type,
        "body_typ": $scope.addingItem.body_typ
    });
    $scope.addingItem = [];
};

$scope.addRecordEngines = function () {
    $scope.engines.push({
        "name": $scope.addingItem.name,
        "gear": $scope.addingItem.gear,
        "power": $scope.addingItem.power,
        "naped": $scope.addingItem.naped,
        "burn": $scope.addingItem.burn,
        "cena": $scope.addingItem.cena,
        "boost": $scope.addingItem.boost,
        "burn": $scope.addingItem.burn,
        "co2": $scope.addingItem.co2
    })
    $scope.addingItem = [];
};