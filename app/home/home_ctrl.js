(function () {

    "use strict";


    var uniqueItems = function (data, key) {
        var result = new Array();
        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if (result.indexOf(value) == -1) {
                result.push(value);
            }

        }
        return result;
    };


    angular.module("iApp", ['smart-table', 'ngDraggable'])
       /* .factory('myhttpserv', function ($http) {

            return $http.get('storage.txt').error(function (status) {
                console.log(status)
            });
        })*/
        .filter('unique', function () {

            return function (arr, field) {
                var o = {}, i, l = arr.length, r = [];
                for (i = 0; i < l; i += 1) {
                    o[arr[i][field]] = arr[i];
                }
                for (i in o) {
                    r.push(o[i]);
                }
                return r;
            };
        }).filter('groupBy',
        function () {
            return function (collection, key) {
                if (collection === null) return;
                return uniqueItems(collection, key);
            };
        }).controller('TestController', function ($scope, $http, $filter, orderByFilter, filterFilter) {


      //  myhttpserv.then(function (response) {});, myhttpserv

            $scope.addTodo1 = function (scope, file) {
                alert(12)
            }

            $scope.addTodo = function (scope, file) {

                var CONF = confirm("Czy nadpisać zmiany w " + file);

                if (CONF == true) {

                    var data = {
                        'path': file,
                        'data': JSON.stringify(scope)
                    };

                    $http.post('save.php', data)
                        .error(function (status) {
                            console.log(status)
                        });


                }
            };




        $scope.search = [];
        $scope.search2 = [];
        $scope.search2A = [];
        $scope.search2B = [];
        $scope.searchBodyTyp = [];
        $scope.search5 = "Wybierz pakiet...";
        $scope.engineURL = '';
        $scope.pakiets = '';
        $scope.price = 0;
        $scope.orderedCar = {};
        $scope.myValue = true;
        $scope.model1admin = "none";
        $scope.addingItem = [];
        $scope.displayAddonPacks = "none";

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
                $scope.reloadPakiety(pack);

                $http({method: "GET", url: "./json/pakiety.json?" + pack}).then(function mySucces(response) {

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
            $scope.orderedCar.typ = typ;
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


        $scope.loadJSONtoScope3 = function (adress, pack, scopeJSON) {
            $http({method: "GET", url: adress}).then(function mySucces(response) {
                $scope.color = response.data["F30"];

            }, function myError(response) {
                alert("E r r o r  3667 !");
            });
        };

        $scope.loadJSONtoScope4 = function (adress, pack, scopeJSON) {
            $http({method: "GET", url: adress}).then(function mySucces(response) {
                $scope.wheels = response.data["F30"];
            }, function myError(response) {
                alert("E r r o r  3667 !");
            });
        };


        $scope.geModelPackElementAliasFromID = function geModelPackElementAliasFromID(n) {
            return (objectFindByKey($scope.pakiet, "item_id", n).name);
        };

        function objectFindByKey(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                    return array[i];

                }
            }
            return null;
        }

        $scope.reloadPakiety = function reloadPakiety(pack) {
            $scope.pakiety5admin = 'block';
            $scope.loadJSONtoScope2("./json/pakiety.json", pack, $scope.pakiety);
            $scope.pakiets = "./subsites/pakiety5.html";
        };

        $scope.loadJSONtoScope3("./json/colors.json", "F30", $scope.color);
        $scope.loadJSONtoScope4("./json/wheels.json", "F30", $scope.wheels);


        // $scope.reloadPakiety();


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

        $scope.packElement = [];
        $scope.selectedPakiet = 0;

        $scope.countFreePacks = function () {

            $scope.orderedCar.free_pack_price = 0;

            for (var i = 0; i < $scope.pakiety[$scope.selectedPakiet].pack_alt.length; i++) {

                if (!comparePacks($scope.packElement, $scope.pakiety[$scope.selectedPakiet].pack_alt[i][0]))


                    if ($scope.packElement, $scope.pakiety[$scope.selectedPakiet].pack_alt[i].selectedItem == true) {
                        console.log(">>>>", $scope.packElement, $scope.pakiety[$scope.selectedPakiet].pack_alt[i][0])
                        $scope.orderedCar.free_pack_price = Number($scope.pakiety[$scope.selectedPakiet].pack_alt[i][1]) + Number($scope.orderedCar.free_pack_price);
                    }

            }
        };

        function comparePacks(array, key) {
            var bool = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i][0] === key) {
                    bool = true;
                    //console.log(array[i][0], key)
                }
            }
            return bool;
        };

        //$scope.orderedCar.packs_id= 337

        $scope.setPackElement = function (list, name) {

            $scope.search5 = name;
            $scope.packElement = list;
            $scope.displayAddonPacks = "inline-table";


            for (var i = 0; i < $scope.pakiety[$scope.selectedPakiet].pack_alt.length; i++) {
                $scope.pakiety[$scope.selectedPakiet].pack_alt[i].selectedItem = true;

                if (comparePacks($scope.packElement, $scope.pakiety[$scope.selectedPakiet].pack_alt[i][0]))
                    $scope.pakiety[$scope.selectedPakiet].pack_alt[i].selectedItem = true;
                else
                    $scope.pakiety[$scope.selectedPakiet].pack_alt[i].selectedItem = false;
            }
            $scope.countFreePacks();
        };

        $scope.setPacks = function (type, pack_price, packs_id) {
            $scope.orderedCar.pack_price = pack_price;
            $scope.orderedCar.packs_id = packs_id;

            for (var i = 0; i < $scope.packs.length; i++) {
                $scope.packs[i].selectedItem = ""; // $scope.packs[i].abadonAtSumming="yes"
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


        /////////////////////////////////////////////////////Admin


        console.log('ADMIN PANEL');
        /*
         $scope.loadJSONtoScope2 = function (adress, pack, scopeJSON) {
         $http({method: "GET", url: adress}).then(function mySucces(response) {
         $scope.pakiety = response.data;

         }, function myError(response) {
         alert("E r r o r  3667 !");
         });
         };

         $scope.selectedPakiet = 0;
         $scope.reloadPakiety = function reloadPakiety() {
         $scope.pakiety5admin = 'block';
         $scope.loadJSONtoScope2("./json/pakiety2.json", "F30", $scope.pakiety);
         $scope.pakiets = "./subsites/pakiety5.html";
         };
         */


        $scope.searchVechicelsInAadmin = [];

        $scope.setEngineFilter = function (filtr, item) {
            $scope[filtr] = item;
        };

        /*
         $scope.loadJSONtoScope2 = function (adress, pack, scopeJSON) {
         $http({method: "GET", url: adress}).then(function mySucces(response) {
         $scope.pakiety = response.data;

         }, function myError(response) {
         alert("E r r o r  3667 !");
         });
         };
         */

        $scope.changePakiety = function (x) {
            $scope.selectedPakiet = Number(x);
            $scope.reloadPakiety();

        };


        /*
         $scope.pakiets = [];
         $scope.pakiety5admin="";
         $scope.reloadPakiety = function reloadPakiety() {
         $scope.pakiety5admin = 'block';
         $scope.loadJSONtoScope2("./json/pakiety2.json", "F30", $scope.pakiety);
         $scope.pakiets = "./subsites/pakiety5.html";
         };
         */
        //$scope.reloadPakiety();

        $scope.removeItem = function removeItem(row) {
            var index = $scope.vehicles.indexOf(row);
            console.log(index)
            if (index !== -1) {
                $scope.vehicles.splice(index, 1);
            }
        };

        $scope.removeItemEngines = function removeItem(row, row_0, xxx) {

            console.log(xxx)
            console.log(row)
            console.log(row_0)
            //  var index = $scope.engines_all["F31"].indexOf(row);
            // if (index !== -1) {
            //     $scope.engines["F31"].splice(index, 1);
            //  }
        };


        $scope.pakiety = ["pakiety"];
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

        $scope.getWheelName = function (n) {

            return (   String(objectFindByKey($scope.wheels, "id", String(n)).name) );
        };

        $scope.getWheelSize = function (n) {
            return (   objectFindByKey($scope.wheels, "id", String(n)).size   );
        };

        $scope.getColorHex = function (n) {
            return (   objectFindByKey($scope.color, "id_color", String(n)).hex   );
        };

        $scope.getColorName = function getColorName(n) {
            return ( objectFindByKey($scope.color, "id_color", String(n)).name);
        };
        $scope.getColorID = function getColorID(n) {
            return (objectFindByKey($scope.vehicles, "model_id", n).name);
        };


        $scope.geModelPackElementAliasFromID = function geModelPackElementAliasFromID(n) {
            return (objectFindByKey($scope.pakiet, "item_id", n).name);
        };

        $scope.geModelAliasFromID = function geModelAliasFromID(n) {
            return (objectFindByKey($scope.vehicles, "model_id", n).name);
        };

        function objectFindByKey(array, key, value) {
            for (var i = 0; i < array.length; i++) {


                if (array[i][key] == value) {
                    //console.log(array[i].name);
                    //console.log(array[i].name);

                    return array[i];
                }
            }
            return "";
        }

        $scope.addRecordPackGroup = function () {

            $scope.pakiety.push({
                "model_id": $scope.addingItem.model_id,
                "body_colors": [],
                "wheels": [],
                "pack_alt": [],
                "list": [{
                    "pack_id": "",
                    "name": "",
                    "list": []
                }]
            });

            console.log($scope.addingItem);
            $scope.addingItem = [];

        };


        $scope.removeItemRow = function removeItemRow(row, id) {
            //console.log(row,id);
            ///  var index =$scope.pakiety.indexOf(row);

            // if (index !== -1) {
            ///   $scope.pakiety[]
            // }
        };


        $scope.removeRecordPackGroup = function (id) {
            $scope.pakiety.splice(id, 1);
        };

        $scope.removeItem112 = function removeItem(row) {
            var index = $scope.vehicles.indexOf(row);
            if (index !== -1) {
                $scope.vehicles.splice(index, 1);
            }
        };

        $scope.removeItemEngines112 = function removeItem(row, row_0) {
            var index = $scope.engines_all["F31"].indexOf(row);
            if (index !== -1) {
                $scope.engines["F31"].splice(index, 1);
            }
        };


        $scope.addRecordPackItemOne = function (row, id) {
            row.list[id].list.push([$scope.addingItem.first, $scope.addingItem.second]);
            $scope.addingItem = [];
        }

        $scope.addPackColorItem = function (row, id) {
            row.push([$scope.addingItem.xxx]);
            $scope.addingItem = [];
        }

        $scope.addPackFreeItem2 = function (row, id) {
            row.push({
                "item_id": $scope.addingItem.item_id,
                "model": $scope.addingItem.model,
                "name": $scope.addingItem.name,
                "equ_group": $scope.addingItem.equ_group
            });
            $scope.addingItem = [];

        }

        $scope.addColorItem = function (row, id) {
            row.push({
                "id_color": $scope.addingItem.id_color,
                "name": $scope.addingItem.name,
                "hex": $scope.addingItem.hex
            });
            $scope.addingItem = [];

        }

        $scope.addWheelItem = function (row) {
            row.push({
                "id": $scope.addingItem.id,
                "size": $scope.addingItem.size,
                "name": $scope.addingItem.name,
                "price": $scope.addingItem.price,
                "pack_id": $scope.addingItem.pack_id
            });
            $scope.addingItem = [];
        }

        $scope.addPackFreeItem = function (row, id) {
            row.push([$scope.addingItem.item_id, $scope.addingItem.price]);
            $scope.addingItem = [];
        }
        $scope.removePackFreeItem = function (row, id) {
            console.log(row, id);
            row.splice(id, 1);
        }


        /*$scope.removeRecordPackOne = function (row,id) {
         row.list.splice(id, 1);
         }

         $scope.removeRecordPackItemOne = function (id,row_0) {
         row_0.list.splice(id, 1);

         }*/

        $scope.addRecordOnePack = function (id) {
            console.log(id);
            $scope.pakiety[id].list.push({
                "pack_id": $scope.addingItem.pack_id,
                "name": $scope.addingItem.name,
                "price": $scope.addingItem.price,
                "price_rata": $scope.addingItem.price_rata,
                "list": []
            });


            $scope.addingItem = [];
        };

        $scope.addEngine = function (row, id) {
            console.log(row, id);
            row.list.push({
                "name": $scope.addingItem.name,
                "gear": $scope.addingItem.gear,
                "power": $scope.addingItem.power,
                "naped": $scope.addingItem.naped,
                "burn": $scope.addingItem.burn,
                "cena": $scope.addingItem.cena,
                "boost": $scope.addingItem.boost,
                "co2": $scope.addingItem.co2,
                "rata": $scope.addingItem.rata,
                "typ": $scope.addingItem.typ
            });
            $scope.addingItem = [];
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
                "co2": $scope.addingItem.co2
            });

            $scope.addingItem = [];
        };


        $scope.onDragComplete = function (data, evt) {
            console.log("drag success, data:", data);
            var index = $scope.pakiety.indexOf(data);
            if (index > -1) {
                $scope.pakiety.splice(index, 1);
            }
        }

        $scope.onDrop = function (data, evt, row) {
            console.log("row  >>>:", row);
            console.log(" data>>>:", data.id);
            row.push([data.id]);
        }

        $scope.onDropCompleted = function (data, evt, row) {
            console.log(">>>:", 1);
            row.push([String(data.id_color)]);
        }
        $scope.onDropComplete = function (data, evt, row) {
            console.log("drop success, data>>>:", row, data.item_id);
            row.list.push([String(data.item_id)]);
        }

        $scope.onDropCompleteAlt = function (data, evt, row) {
            console.log("drop success, data>>>:", row, data.item_id);

            row.pack_alt.push([String(data.item_id)]);
        }

        $scope.onDropCompleteInput = function (data, evt) {
            console.log("drop on input success, data<<<<:", data.item_id);
            // $scope.input = data;
        }

        $scope.onDropCompleteRemove = function (data, evt) {
            console.log("drop success - remove, data:", data);
            var index = $scope.droppedObjects.indexOf(data);
            if (index != -1)
                $scope.droppedObjects.splice(index);
        }

        var onDraggableEvent = function (evt, data) {
            console.log("128", "onDraggableEvent", evt, data);
        }

        $scope.$on('draggable:start', onDraggableEvent);
        //$scope.$on('draggable:move', onDraggableEvent);
        $scope.$on('draggable:end', onDraggableEvent);


        // $scope.$on('draggable:start', onDraggableEvent);
        //$scope.$on('draggable:move', onDraggableEvent);
        //  $scope.$on('draggable:end', onDraggableEvent);


    });


    $("#wrapped").scroll(function () {
        alert(3)//  $( "#log" ).append( "<div>Handler for .scroll() called.</div>" );
    });

    var wrap = $("#wrapped");
    //var lastScrollTop = 0;
    $(window).scroll(function (event) {
        var st = $(this).scrollTop();
        if (st > 520) {
            $("#wrapped").css("position", "fixed");//.addClass(".fix-search");//  alert(st)// downscroll code
            $("#wrpaped").css("top", "1px");//.addClass(".fix-search");//  alert(st)// downscroll code
            //$("#wrpaped").css("height", "100px");//.addClass(".fix-search");//  alert(st)// downscroll code
        } else {
            //alert(st) // upscroll code
            $("#wrapped").css("position", "inherit");
        }
        // lastScrollTop = st;
    });


    // $("body");
    //
    // wrap.on("scroll", function(e) {
    //     alert(3)
    //     if (this.scrollTop > 147) {
    //         alert(1)///wrap.addClass("fix-search");
    //     } else {
    //         wrap.removeClass("fix-search");
    //     }
    //
    // });

})();

