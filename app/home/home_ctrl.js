(function () {
    "use strict";
    angular.module("iApp")
        .controller('TestController', function ($scope, $http, $filter, orderByFilter, filterFilter) {

            $scope.search = [];
            $scope.search2 = [];
            $scope.search2A = [];
            $scope.search2B = [];
            $scope.searchBodyTyp = [];
            $scope.search5 = "Wybierz pakiet...";
            $scope.engineURL = '';
            $scope.engineURL = '';
            $scope.pakiets = '';
            $scope.price = 0;
            $scope.orderedCar = {};
            $scope.myValue = true;
            $scope.model1admin = "none";
            $scope.addingItem = [];

            $scope.packsCheckBoxSynchro = function (x) {
                console.log(x);
                x = "true"
            };

            $scope.changeEngine = function (x) {
                $scope.engines_selected = Number(x);
            };

            $scope.displayGM = function (x) {

                if (!x) {
                    document.getElementById("g_mod1").style.display = "inline-table";
                    document.getElementById("g_mod2").style.display = "inline-table";
                    document.getElementById("g_mod3").style.display = "none";
                }
                else {
                    document.getElementById("g_mod1").style.display = "none";
                    document.getElementById("g_mod2").style.display = "none";
                    document.getElementById("g_mod3").style.display = "inline-table";
                }
                return x;
            };

            $http({
                method: "GET",
                url: "./json/vehicles.json"
            }).then(function mySucces(response) {
                $scope.vehicles = response.data.records;
            }, function myError(response) {
                alert("E r r o r  1 !");
            });

            $scope.engines = [];

            $http(
                {
                    method: "GET",
                    url: "./json/pakiet.json"
                }
            ).then(function mySucces(response) {
                $scope.pakiet = response.data.records
            }, function myError(response) {
                alert("E r r o r  1 !");
            });

            $scope.engines_all = [];
            $scope.engines_selected = [];

            $scope.loadJSONtoScope = function (adress, pack, type) {
                $http({method: "GET", url: adress}).then(function mySucces(response) {


                    for (var i in response.data) {
                        if (response.data[i].engin == String(pack)) {
                            $scope.engines_selected = i;
                        }
                    }


                    $scope.engines_all = response.data;
                    document.getElementById(type).disabled = false;
                    $scope.engineURL = "./subsites/engine3.html";
                    $scope.pakiets = "";


                    $http({method: "GET", url: "./json/packs.json?" + pack}).then(function mySucces(response) {

                        $scope.packs = response.data[pack];
                        $http(
                            {
                                method: "GET",
                                url: "./json/wheels.json?" + pack
                            }
                        ).then(function mySucces(response) {
                            $scope.wheels = response.data[pack];
                        }, function myError(response) {
                            alert("E r r o r  5 6 !");
                        });


                        $http(
                            {
                                method: "GET",
                                url: "./json/colors.json?" + pack
                            }
                        ).then(function mySucces(response) {
                            $scope.color = response.data[pack];
                        }, function myError(response) {
                            alert("E r r o r  2 4 2 !");
                        });


                    }, function myError(response) {
                        alert("E r r o r  4 4 !");
                    });

                }, function myError(response) {
                    alert("E r r o r  3 !");
                });
            };

            $scope.showButton1 = function (type, id, row_img) {
                $scope.engineURL = "";
                $scope.row_img = row_img;
                $scope.orderedCar.engine_id = id;
                $scope.loadJSONtoScope("./json/engines.json", String(id), type);
            };

            $scope.showButton2 = function (type, typ) {
                $scope.orderedCar.typ = typ
                document.getElementById(type).disabled = false;
                $scope.pakiets = "./subsites/pakiety5.html"
            };


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

            $scope.reloadPakiety();

            $scope.hideButton1 = function (type) {
                $scope.something = {};
                document.getElementById(type).disabled = true;
            };

            //1
            $scope.filtrCarType = "";

            $scope.filtrujModele = function (type) {
                $scope.filtrCarType = type;
                document.getElementById("g_mod0").style.display = "inline-table";
                $('input[name="body_typ"]').attr('checked', false);
                $('input[name="Grupa"]').attr('checked', false);
                $('input[name="Modele"]').attr('checked', false);
                $scope.searchVechicelsInAadmin = [];
                $scope.searchBodyTyp = [];
                $scope.search = [];
            };

            $scope.filterNadwozie = function (type) {
                $scope.searchBodyTyp = type;

                $scope.searchVechicelsInAadmin = [];
                $scope.search = [];
                $('input[name="body_typ"]').attr('checked', false);
                $('input[name="Modele"]').attr('checked', false);
            };
            //2
            $scope.filterGrupaModelowa = function (type) {

                $scope.search = type;
                $('input[name="Modele"]').attr('checked', false);
                $scope.hideButton1("button1");
            };

            $scope.setWheelsPrice = function (n) {
                $scope.orderedCar.wheelsPrice = n;
            };


            $scope.countFreePacks = function () {
                $scope.orderedCar.free_pack_price = 0;
                for (var i = 0; i < $scope.packs.length; i++) {
                    if ($scope.packs[i].Pakiet != $scope.search5 && $scope.packs[i].waluta1 == "true") {
                        $scope.orderedCar.free_pack_price = Number($scope.packs[i].price_out) + Number($scope.orderedCar.free_pack_price);
                    }
                }
            };

            //$scope.orderedCar.packs_id= 337

            $scope.packElement = [];
            $scope.setPackElement = function (list, name) {

                $scope.search5 = name;
                $scope.packElement = list;
            };


            $scope.setPacks = function (type, pack_price, packs_id) {
                $scope.orderedCar.pack_price = pack_price;

                $scope.orderedCar.packs_id = packs_id;

                for (var i = 0; i < $scope.packs.length; i++) {
                    $scope.packs[i].waluta1 = ""; // $scope.packs[i].abadonAtSumming="yes"
                }
                ////// $scope.packs[0].waluta1="";
                // $('input[type=checkbox]').attr('checked',false);
                //$('.resetCheckbox').attr('checked',false);
                //$('.resetCheckbox').attr('ng-model',false);
                $scope.search5 = type;

                document.getElementById('button4').disabled = false;
                //$scope.packsElements = filterFilter(orderByFilter($scope.packs, "Pakiet"), type);
                // $scope.packsElements =$scope.packs;
            };


            $scope.packsElements = [];
            $scope.packsElementsName = "";


            $scope.colourIncludes = [];
            $scope.typ1 = "";

            $scope.setColorBody = function (colour, colorName) {
                $scope.orderedCar.colour = colour;
                $scope.orderedCar.colorName = colorName;

            };

            //konfiguracja sortowania tabel
            $scope.list = $scope.$parent.personList;
            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            };


            $scope.reloadEngines = function reloadEngines() {
                $scope.model1admin = 'block';
                $scope.engineURL = "./subsites/engine3.html";
                $scope.loadJSONtoScope("./json/engines.json", "F30", "F30");
            };


        });


})();
