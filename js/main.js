    function show(n) {
        if (document.getElementById("t" + n).style.display == "block") {
            document.getElementById("t" + n).style.display = "none";
            document.getElementById("i" + n).style.transform = "rotate(0deg)";
        }
        else {
            document.getElementById("t" + n).style.display = "block";
            document.getElementById("i" + n).style.transform = "rotate(90deg)";
        }
    }


    function setStep(n) {
        document.getElementById("progbar").style.width = n * 16.666 + "%";
        document.getElementById("steps").innerHTML = "Step " + n + "/6";
    }

    setStep(0)

    function hide() {
        document.getElementById("t1").style.display = "none";
        document.getElementById("t2").style.display = "none";
        document.getElementById("t3").style.display = "none";
        document.getElementById("t4").style.display = "none";
        document.getElementById("im1").style.display = "none";
        document.getElementById("im2").style.display = "initial";
        document.getElementById("im3").style.display = "none";
        document.getElementById("im4").style.display = "none";
        activeted();
    }

    // hide();

    function activeted() {

        //alert(document.getElementById("im"+1).style.display +","+document.getElementById("im"+2).style.display +","+document.getElementById("im"+3).style.display +","+document.getElementById("im"+4).style.display +",")

        if (document.getElementById("im" + 1).style.display == "initial" && document.getElementById("im" + 2).style.display == "initial" && document.getElementById("im" + 3).style.display == "initial" && document.getElementById("im" + 4).style.display == "initial") {
            document.getElementById("btnPO").disabled = false;
            document.getElementById("gdx").style.display = "none";
        }
        else {
            document.getElementById("btnPO").disabled = true;
            document.getElementById("gdx").style.display = "initial";
        }

    }

    function check_box(event, n) {
        //alert(event.checked+","+n);
        if (event.checked) {
            document.getElementById("im" + n).style.display = "initial";
            $("#i" + n).addClass("grayNow");
        }
        else {
            document.getElementById("im" + n).style.display = "none";
            $("#i" + n).removeClass("grayNow");
        }
        activeted()
    }

    $('.btnNext').click(function () {
        $('.nav3 > .active').next('li').find('a').trigger('click');
    });

    $('.btnPrev').click(function () {
        $('.nav3 > .active').prev('li').find('a').trigger('click');
    });


    // Code goes here

    var iApp = angular.module("App", []);


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

    iApp.filter('groupBy',
            function () {
                return function (collection, key) {
                    if (collection === null) return;
                    return uniqueItems(collection, key);
                };
            });

    /* */




    iApp.controller('TestController', function ($scope, $http, $filter, orderByFilter, filterFilter) {

        $scope.search = [];
        $scope.search2 = [];

        $scope.price = 00;
        $scope.something = {};


        $scope.filtrujSilnik = function (type,filtr) {
            $scope.engines_end = $scope.engines_mark = $scope.engines_all = filterFilter(orderByFilter($scope.engines, filtr), type);
        }


        $scope.displayGM = function(x) {

            if(!x) {

               document.getElementById("g_mod1").style.display = "inline-table";
                document.getElementById("g_mod2").style.display = "inline-table";
                document.getElementById("g_mod3").style.display = "none";
            }
            else{
                document.getElementById("g_mod1").style.display = "none";
              document.getElementById("g_mod2").style.display = "none";
                document.getElementById("g_mod3").style.display = "inline-table";
            }
            return x;
        };


        $http({
            method : "GET",
            url : "./json/vehicles.json"
        }).then(function mySucces(response) {
            $scope.vehicles_end = $scope.vehicles_mark = $scope.vehicles_all = $scope.vehicles =response.data.records //= JSON.parse(data);;
        }, function myError(response) {
           alert("E r r o r  1 !");
        });

        $http(
            {
                method : "GET",
                url : "./json/engines.json"
            }
        ).then(function mySucces(response) {
            console.log(response.data.records);
            $scope.engines_end = $scope.engines_mark = $scope.engines_all = $scope.engines =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });

        $http(
            {
                method : "GET",
                url : "./json/colors.json"
            }
        ).then(function mySucces(response) {
            console.log(response.data.records);
            $scope.color =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });

        $http(
            {
                method : "GET",
                url : "./json/wheels.json"
            }
        ).then(function mySucces(response) {
            //console.log(response.data.records);
            $scope.wheels =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });

        $http(
            {
                method : "GET",
                url : "./json/packs.json"
            }
        ).then(function mySucces(response) {
            //console.log(response.data.records);
            $scope.packs =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });


        $http(
            {
                method : "GET",
                url : "./json/pakiet.json"
            }
        ).then(function mySucces(response) {
            //console.log(response.data.records);
            $scope.pakiet =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });




        $scope.showButton1 = function (type) {
			document.getElementById(type).disabled = false;
		}

        $scope.hideButton1 = function (type) {
            $scope.something = {};
            document.getElementById(type).disabled = true;
        }
        //1
        $scope.filtrujModele = function (type) {

            document.getElementById("g_mod0").style.display = "inline-table";

            $scope.vehicles_mark = $scope.vehicles_end = $scope.vehicles_all = filterFilter(orderByFilter($scope.vehicles, "mark"), type);
            $('input[name="body_typ"]').attr('checked', false);
            $('input[name="Grupa"]').attr('checked', false);
            $('input[name="Modele"]').attr('checked', false);
        }

        $scope.filterNadwozie = function (type) {

            $scope.vehicles_end = $scope.vehicles_all = vehicles_mark = filterFilter(orderByFilter($scope.vehicles_mark, "car_type"), type);
            $scope.vehicles_end = $scope.vehicles_all;
            $('input[name="body_typ"]').attr('checked', false);
            $('input[name="Modele"]').attr('checked', false);
        }
        //2
        $scope.filterGrupaModelowa = function (type) {
            $scope.vehicles_end = $scope.vehicles_all;
            $scope.vehicles_end = filterFilter(orderByFilter($scope.vehicles_end, "name"), type);
            $('input[name="Modele"]').attr('checked', false);
            $scope.hideButton1("button1");
        }


        $scope.colourIncludes = [];
        $scope.typ1=""

        $scope.includeColour = function(colour,typ1) {
            $scope.typ1=typ1;
            var i = $.inArray(colour, $scope.colourIncludes);
            if (i > -1) {
                $scope.colourIncludes.splice(i, 1);
            } else {
                $scope.colourIncludes.push(colour);
            }
        }

        $scope.colourFilter = function(fruit) {
            if ($scope.colourIncludes.length > 0) {
                console.log($scope.typ1);
                if ($.inArray(fruit["gear"], $scope.colourIncludes) < 0 && $.inArray(fruit["typ"], $scope.colourIncludes) < 0 && $.inArray(fruit["naped"], $scope.colourIncludes) < 0)
                    return;
            }

            return fruit;
        }

    });



