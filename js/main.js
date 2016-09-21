
    function simpleController($scope) {
        $scope.questionPaper = {
            "id": "1",
            "subject": "AngularJS",
            "title": 'Exam#01',
            "questions": [{
                "id": "9",
                "options": [{
                    "id": "22",
                    "description": "yes",
                    "orderId": "1"
                }, {
                    "id": "23",
                    "description": "now",
                    "orderId": "2"
                },

                    {
                        "id": "24",
                        "description": "don't know",
                        "orderId": "3"
                    }
                ],
                "description": "Question#01?",
                "orderId": "1"
            }, {
                "id": "10",
                "options": [{
                    "id": "25",
                    "description": "Home",
                    "orderId": "1"
                }, {
                    "id": "26",

                    "description": "Work",
                    "orderId": "2"
                }, {
                    "id": "27",
                    "description": "Undecided or Other",
                    "orderId": "3"
                }],
                "description": "Where to go?",
                "orderId": "2"
            }, {
                "id": "20",
                "options": [{
                    "id": "53",
                    "description": "Wrong Direction",
                    "orderId": "1"
                }, {
                    "id": "54",
                    "description": "Right Direction",
                    "orderId": "2"
                }, {
                    "id": "55",
                    "description": "Don't know",
                    "orderId": "3"
                }],
                "description": "Are you belive your in?",
                "orderId": "2"
            }],
            "updatedOn": "2014-07-12 18:20:52"
        };

        $scope.selected_ids = [];
        $scope.submitAnswers = function () {
            angular.forEach($scope.questionPaper.questions, function (question) {
                $scope.selected_ids.push(question.selected_id);
            });
        }
    }


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
        document.getElementById("progbar").style.width = n * 25 + "%";
        document.getElementById("steps").innerHTML = "Step " + n + "/4";
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


    iApp.controller('TestController', function ($scope, $filter, orderByFilter, filterFilter) {

	  $scope.color = {};

        $scope.search = [];

        $scope.Models = {
            Limousine: false,
            Avant: false,
            Sportback: false,
            Coupe: false,
            Cabriolet: false,
            allroad_quattro: false,
            SUV: false,
            luxury: false,
            double_suite: false
        };


        $scope.vehicles = [
            {mark: "BMW", name: 'A1 Sportback', car_type: 'A1', nadwozie: "Limousine"},
            {mark: "BMW", name: 'A2 Sportback', car_type: 'A1', nadwozie: "Sportback"},
            {mark: "BMW", name: 'A3 Sportback', car_type: 'A1', nadwozie: "Avant"},

            {mark: "BMW", name: 'B1 Sportback', car_type: 'B1', nadwozie: "Sportback"},
            {mark: "BMW", name: 'B2 Sportback', car_type: 'B1', nadwozie: "Avant"},
            {mark: "BMW", name: 'B3 Sportback', car_type: 'B1', nadwozie: "Limousine"},

            {mark: "BMW", name: 'C1 Sportback', car_type: 'C1', nadwozie: "Limousine"},
            {mark: "BMW", name: 'C2 Sportback', car_type: 'C1', nadwozie: "Sportback"},
            {mark: "BMW", name: 'C3 Sportback', car_type: 'C1', nadwozie: "Avant"},

            {mark: "Audi", name: 'Limousine', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'Sportback', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'Limousine', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'Limousine', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'ZZ Avant', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'ZZ allroad quattro', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'ZZ Limousine', car_type: 'x', nadwozie: "Limousine"},
            {mark: "Audi", name: 'ZZ Avant', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Sportback', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Cabriolet', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Coupe', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Sportback', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Cabriolet', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Limousine', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Avant', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ allroad quattro', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Limousine', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'ZZ Avant', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: '6 Avant', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: '6 Avant performance', car_type: 'x', nadwozie: "Avant"},
            {mark: "Audi", name: 'A7 Sportback', car_type: 'A7', nadwozie: "Sportback"},
            {mark: "Audi", name: 'S7 Sportback', car_type: 'S7', nadwozie: "Sportback"},
            {mark: "Audi", name: 'RS 7 Sportback', car_type: 'S7', nadwozie: "Sportback"},
            {mark: "Audi", name: 'RS 7 Sportback performance', car_type: 'S7', nadwozie: "Sportback"},
            {mark: "Audi", name: 'A8', car_type: 'A8', nadwozie: "Sportback"},
            {mark: "Audi", name: 'A8 L', car_type: 'A8', nadwozie: "Sportback"},
            {mark: "Audi", name: 'A8 L W12', car_type: 'A8', nadwozie: "Sportback"},
            {mark: "Audi", name: 'S8', car_type: 'A8', nadwozie: "Sportback"},
            {mark: "Audi", name: 'S8 plus', car_type: 'A8', nadwozie: "Sportback"},
            {mark: "Audi", name: 'Q2', car_type: 'Q2', nadwozie: "Sportback"},
            {mark: "Audi", name: 'Q3', car_type: 'Q3', nadwozie: "Sportback"},
            {mark: "Audi", name: 'RS Q3', car_type: 'Q3', nadwozie: "Sportback"},
            {mark: "Audi", name: 'Q5', car_type: 'Q3', nadwozie: "Coupe"},
            {mark: "Audi", name: 'SQ5 TDI', car_type: 'Q5', nadwozie: "Coupe"},
            {mark: "Audi", name: 'Q7', car_type: 'Q3', nadwozie: "Coupe"},
            {mark: "Audi", name: 'Q7 e-tron', car_type: 'Q7', nadwozie: "Coupe"},
            {mark: "Audi", name: 'SQ7 TDI', car_type: 'Q7', nadwozie: "Coupe"},
            {mark: "Audi", name: 'TT Coupe', car_type: 'TT', nadwozie: "Coupe"},
            {mark: "Audi", name: 'TTS Coupe', car_type: 'TT', nadwozie: "Coupe"},
            {mark: "Audi", name: 'R8 Coupe', car_type: 'R8', nadwozie: "Coupe"},

            {mark: "Audi", name: 'SQ5 TDI', car_type: 'Q5', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'Q7', car_type: 'Q3', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'Q7 e-tron', car_type: 'Q7', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'SQ7 TDI', car_type: 'Q7', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'TT Coupe', car_type: 'TT', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'TTS Coupe', car_type: 'TT', nadwozie: "Cabriolet"},
            {mark: "Audi", name: 'R8 Coupe', car_type: 'R8', nadwozie: "Cabriolet"},

            {mark: "Audi", name: 'SQ5 TDI', car_type: 'Q5', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'Q7', car_type: 'Q3', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'Q7 e-tron', car_type: 'Q7', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'SQ7 TDI', car_type: 'Q7', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'TT Coupe', car_type: 'TT', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'TTS Coupe', car_type: 'TT', nadwozie: "allroad quattro"},
            {mark: "Audi", name: 'R8 Coupe', car_type: 'R8', nadwozie: "allroad quattro"},

            {mark: "Audi", name: 'SQ5 TDI', car_type: 'Q5', nadwozie: "SUV"},
            {mark: "Audi", name: 'Q7', car_type: 'Q3', nadwozie: "SUV"},
            {mark: "Audi", name: 'Q7 e-tron', car_type: 'Q7', nadwozie: "SUV"},
            {mark: "Audi", name: 'SQ7 TDI', car_type: 'Q7', nadwozie: "SUV"},
            {mark: "Audi", name: 'TT Coupe', car_type: 'TT', nadwozie: "SUV"},
            {mark: "Audi", name: 'TTS Coupe', car_type: 'TT', nadwozie: "SUV"},
            {mark: "Audi", name: 'R8 Coupe', car_type: 'R8', nadwozie: "SUV"},

        ];

        $scope.vehicles_all = $scope.vehicles;
        $scope.vehicles_end = $scope.vehicles_mark = $scope.vehicles_all;


        $scope.showButton1 = function (type) {
			document.getElementById(type).disabled = false;
		}
		
        $scope.filtrujModele = function (type) {
            // alert(type)
            $scope.vehicles_mark = $scope.vehicles_end = $scope.vehicles_all = filterFilter(orderByFilter($scope.vehicles, "mark"), type);

        }

        $scope.filterNadwozie = function (type) {
            // $scope.vehicles_all = $scope.vehicles;
            $scope.vehicles_all = filterFilter(orderByFilter($scope.vehicles_mark, "car_type"), type);
            $scope.vehicles_end = $scope.vehicles_all
            // $scope.vehicles;
        }

        $scope.filterGrupaModelowa = function (type) {
            // alert(type)
            $scope.vehicles_end = $scope.vehicles_all
            $scope.vehicles_end = filterFilter(orderByFilter($scope.vehicles_end, "name"), type);
        }


    });



