angular.module("iApp").controller('TestController2', function ($scope, $http, $filter, orderByFilter, filterFilter) {

        console.log('ctrl2');

        $scope.loadJSONtoScope2 = function (adress, pack, scopeJSON) {
            $http({method: "GET", url: adress}).then(function mySucces(response) {
                $scope.pakiety = response.data;

            }, function myError(response) {
                alert("E r r o r  3667 !");
            });
        };

        $scope.reloadPakiety = function reloadPakiety() {
            $scope.pakiety5admin = 'block';
            $scope.loadJSONtoScope2("./json/pakiety2.json", "F30", $scope.pakiety);
            $scope.pakiets = "./subsites/pakiety5.html";
        };

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
            var index = $scope.engines_all["F31"].indexOf(row);
            if (index !== -1) {
                $scope.engines["F31"].splice(index, 1);
            }
        };

        $scope.pakiety = [333];
        $scope.pakiety5admin = "none";

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

        $scope.geModelPackElementAliasFromID = function geModelPackElementAliasFromID(n) {
            return (objectFindByKey($scope.pakiet, "item_id", n).name);
        }

        $scope.geModelAliasFromID = function geModelAliasFromID(n) {
            return (objectFindByKey($scope.vehicles, "model_id", n).name);
        }

        function objectFindByKey(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                    return array[i];

                }
            }
            return null;
        }

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
    });