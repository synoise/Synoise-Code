/**
 * @version 2.1.1
 * @license MIT
 */
(function (ng, undefined){
    'use strict';

    ng.module('smart-table', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/smart-table/pagination.html',
            '<nav ng-if="numPages && pages.length >= 2"><ul class="pagination">' +
            '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
            '</ul></nav>');
    }]);


    ng.module('smart-table')
        .constant('stConfig', {
            pagination: {
                template: 'template/smart-table/pagination.html',
                itemsByPage: 10,
                displayedPages: 5
            },
            search: {
                delay: 400, // ms
                inputEvent: 'input'
            },
            select: {
                mode: 'single',
                selectedClass: 'st-selected'
            },
            sort: {
                ascentClass: 'st-sort-ascent',
                descentClass: 'st-sort-descent',
                skipNatural: false
            },
            pipe: {
                delay: 100 //ms
            }
        });
    ng.module('smart-table')
        .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', function StTableController ($scope, $parse, $filter, $attrs) {
            var propertyName = $attrs.stTable;
            var displayGetter = $parse(propertyName);
            var displaySetter = displayGetter.assign;
            var safeGetter;
            var orderBy = $filter('orderBy');
            var filter = $filter('filter');
            var safeCopy = copyRefs(displayGetter($scope));
            var tableState = {
                sort: {},
                search: {},
                pagination: {
                    start: 0,
                    totalItemCount: 0
                }
            };
            var filtered;
            var pipeAfterSafeCopy = true;
            var ctrl = this;
            var lastSelected;

            function copyRefs (src) {
                return src ? [].concat(src) : [];
            }

            function updateSafeCopy () {
                safeCopy = copyRefs(safeGetter($scope));
                if (pipeAfterSafeCopy === true) {
                    ctrl.pipe();
                }
            }

            function deepDelete(object, path) {
                if (path.indexOf('.') != -1) {
                    var partials = path.split('.');
                    var key = partials.pop();
                    var parentPath = partials.join('.');
                    var parentObject = $parse(parentPath)(object)
                    delete parentObject[key];
                    if (Object.keys(parentObject).length == 0) {
                        deepDelete(object, parentPath);
                    }
                } else {
                    delete object[path];
                }
            }

            if ($attrs.stSafeSrc) {
                safeGetter = $parse($attrs.stSafeSrc);
                $scope.$watch(function () {
                    var safeSrc = safeGetter($scope);
                    return safeSrc ? safeSrc.length : 0;

                }, function (newValue, oldValue) {
                    if (newValue !== safeCopy.length) {
                        updateSafeCopy();
                    }
                });
                $scope.$watch(function () {
                    return safeGetter($scope);
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updateSafeCopy();
                    }
                });
            }

            /**
             * sort the rows
             * @param {Function | String} predicate - function or string which will be used as predicate for the sorting
             * @param [reverse] - if you want to reverse the order
             */
            this.sortBy = function sortBy (predicate, reverse) {
                tableState.sort.predicate = predicate;
                tableState.sort.reverse = reverse === true;

                if (ng.isFunction(predicate)) {
                    tableState.sort.functionName = predicate.name;
                } else {
                    delete tableState.sort.functionName;
                }

                tableState.pagination.start = 0;
                return this.pipe();
            };

            /**
             * search matching rows
             * @param {String} input - the input string
             * @param {String} [predicate] - the property name against you want to check the match, otherwise it will search on all properties
             */
            this.search = function search (input, predicate) {
                var predicateObject = tableState.search.predicateObject || {};
                var prop = predicate ? predicate : '$';

                input = ng.isString(input) ? input.trim() : input;
                $parse(prop).assign(predicateObject, input);
                // to avoid to filter out null value
                if (!input) {
                    deepDelete(predicateObject, prop);
                }
                tableState.search.predicateObject = predicateObject;
                tableState.pagination.start = 0;
                return this.pipe();
            };

            /**
             * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
             */
            this.pipe = function pipe () {
                var pagination = tableState.pagination;
                var output;
                filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
                if (tableState.sort.predicate) {
                    filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                pagination.totalItemCount = filtered.length;
                if (pagination.number !== undefined) {
                    pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
                    pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
                    output = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
                }
                displaySetter($scope, output || filtered);
            };

            /**
             * select a dataRow (it will add the attribute isSelected to the row object)
             * @param {Object} row - the row to select
             * @param {String} [mode] - "single" or "multiple" (multiple by default)
             */
            this.select = function select (row, mode) {
                var rows = copyRefs(displayGetter($scope));
                var index = rows.indexOf(row);
                if (index !== -1) {
                    if (mode === 'single') {
                        row.isSelected = row.isSelected !== true;
                        if (lastSelected) {
                            lastSelected.isSelected = false;
                        }
                        lastSelected = row.isSelected === true ? row : undefined;
                    } else {
                        rows[index].isSelected = !rows[index].isSelected;
                    }
                }
            };

            /**
             * take a slice of the current sorted/filtered collection (pagination)
             *
             * @param {Number} start - start index of the slice
             * @param {Number} number - the number of item in the slice
             */
            this.slice = function splice (start, number) {
                tableState.pagination.start = start;
                tableState.pagination.number = number;
                return this.pipe();
            };

            /**
             * return the current state of the table
             * @returns {{sort: {}, search: {}, pagination: {start: number}}}
             */
            this.tableState = function getTableState () {
                return tableState;
            };

            this.getFilteredCollection = function getFilteredCollection () {
                return filtered || safeCopy;
            };

            /**
             * Use a different filter function than the angular FilterFilter
             * @param filterName the name under which the custom filter is registered
             */
            this.setFilterFunction = function setFilterFunction (filterName) {
                filter = $filter(filterName);
            };

            /**
             * Use a different function than the angular orderBy
             * @param sortFunctionName the name under which the custom order function is registered
             */
            this.setSortFunction = function setSortFunction (sortFunctionName) {
                orderBy = $filter(sortFunctionName);
            };

            /**
             * Usually when the safe copy is updated the pipe function is called.
             * Calling this method will prevent it, which is something required when using a custom pipe function
             */
            this.preventPipeOnWatch = function preventPipe () {
                pipeAfterSafeCopy = false;
            };
        }])
        .directive('stTable', function () {
            return {
                restrict: 'A',
                controller: 'stTableController',
                link: function (scope, element, attr, ctrl) {

                    if (attr.stSetFilter) {
                        ctrl.setFilterFunction(attr.stSetFilter);
                    }

                    if (attr.stSetSort) {
                        ctrl.setSortFunction(attr.stSetSort);
                    }
                }
            };
        });

    ng.module('smart-table')
        .directive('stSearch', ['stConfig', '$timeout','$parse', function (stConfig, $timeout, $parse) {
            return {
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.stDelay || stConfig.search.delay;
                    var event = attr.stInputEvent || stConfig.search.inputEvent;

                    attr.$observe('stSearch', function (newValue, oldValue) {
                        var input = element[0].value;
                        if (newValue !== oldValue && input) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(input, newValue);
                        }
                    });

                    //table state -> view
                    scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue, oldValue) {
                        var predicateExpression = attr.stSearch || '$';
                        if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
                            element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
                        }
                    }, true);

                    // view -> table state
                    element.bind(event, function (evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }

                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, attr.stSearch || '');
                            promise = null;
                        }, throttle);
                    });
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stSelectRow', ['stConfig', function (stConfig) {
            return {
                restrict: 'A',
                require: '^stTable',
                scope: {
                    row: '=stSelectRow'
                },
                link: function (scope, element, attr, ctrl) {
                    var mode = attr.stSelectMode || stConfig.select.mode;
                    element.bind('click', function () {
                        scope.$apply(function () {
                            ctrl.select(scope.row, mode);
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue) {
                        if (newValue === true) {
                            element.addClass(stConfig.select.selectedClass);
                        } else {
                            element.removeClass(stConfig.select.selectedClass);
                        }
                    });
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stSort', ['stConfig', '$parse', function (stConfig, $parse) {
            return {
                restrict: 'A',
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {

                    var predicate = attr.stSort;
                    var getter = $parse(predicate);
                    var index = 0;
                    var classAscent = attr.stClassAscent || stConfig.sort.ascentClass;
                    var classDescent = attr.stClassDescent || stConfig.sort.descentClass;
                    var stateClasses = [classAscent, classDescent];
                    var sortDefault;
                    var skipNatural = attr.stSkipNatural !== undefined ? attr.stSkipNatural : stConfig.sort.skipNatural;

                    if (attr.stSortDefault) {
                        sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
                    }

                    //view --> table state
                    function sort () {
                        index++;
                        predicate = ng.isFunction(getter(scope)) ? getter(scope) : attr.stSort;
                        if (index % 3 === 0 && !!skipNatural !== true) {
                            //manual reset
                            index = 0;
                            ctrl.tableState().sort = {};
                            ctrl.tableState().pagination.start = 0;
                            ctrl.pipe();
                        } else {
                            ctrl.sortBy(predicate, index % 2 === 0);
                        }
                    }

                    element.bind('click', function sortClick () {
                        if (predicate) {
                            scope.$apply(sort);
                        }
                    });

                    if (sortDefault) {
                        index = sortDefault === 'reverse' ? 1 : 0;
                        sort();
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().sort;
                    }, function (newValue) {
                        if (newValue.predicate !== predicate) {
                            index = 0;
                            element
                                .removeClass(classAscent)
                                .removeClass(classDescent);
                        } else {
                            index = newValue.reverse === true ? 2 : 1;
                            element
                                .removeClass(stateClasses[index % 2])
                                .addClass(stateClasses[index - 1]);
                        }
                    }, true);
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stPagination', ['stConfig', function (stConfig) {
            return {
                restrict: 'EA',
                require: '^stTable',
                scope: {
                    stItemsByPage: '=?',
                    stDisplayedPages: '=?',
                    stPageChange: '&'
                },
                templateUrl: function (element, attrs) {
                    if (attrs.stTemplate) {
                        return attrs.stTemplate;
                    }
                    return stConfig.pagination.template;
                },
                link: function (scope, element, attrs, ctrl) {

                    scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : stConfig.pagination.itemsByPage;
                    scope.stDisplayedPages = scope.stDisplayedPages ? +(scope.stDisplayedPages) : stConfig.pagination.displayedPages;

                    scope.currentPage = 1;
                    scope.pages = [];

                    function redraw () {
                        var paginationState = ctrl.tableState().pagination;
                        var start = 1;
                        var end;
                        var i;
                        var prevPage = scope.currentPage;
                        scope.totalItemCount = paginationState.totalItemCount;
                        scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

                        start = Math.max(start, scope.currentPage - Math.abs(Math.floor(scope.stDisplayedPages / 2)));
                        end = start + scope.stDisplayedPages;

                        if (end > paginationState.numberOfPages) {
                            end = paginationState.numberOfPages + 1;
                            start = Math.max(1, end - scope.stDisplayedPages);
                        }

                        scope.pages = [];
                        scope.numPages = paginationState.numberOfPages;

                        for (i = start; i < end; i++) {
                            scope.pages.push(i);
                        }

                        if (prevPage !== scope.currentPage) {
                            scope.stPageChange({newPage: scope.currentPage});
                        }
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, redraw, true);

                    //scope --> table state  (--> view)
                    scope.$watch('stItemsByPage', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            scope.selectPage(1);
                        }
                    });

                    scope.$watch('stDisplayedPages', redraw);

                    //view -> table state
                    scope.selectPage = function (page) {
                        if (page > 0 && page <= scope.numPages) {
                            ctrl.slice((page - 1) * scope.stItemsByPage, scope.stItemsByPage);
                        }
                    };

                    if (!ctrl.tableState().pagination.number) {
                        ctrl.slice(0, scope.stItemsByPage);
                    }
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stPipe', ['stConfig', '$timeout', function (config, $timeout) {
            return {
                require: 'stTable',
                scope: {
                    stPipe: '='
                },
                link: {

                    pre: function (scope, element, attrs, ctrl) {

                        var pipePromise = null;

                        if (ng.isFunction(scope.stPipe)) {
                            ctrl.preventPipeOnWatch();
                            ctrl.pipe = function () {

                                if (pipePromise !== null) {
                                    $timeout.cancel(pipePromise)
                                }

                                pipePromise = $timeout(function () {
                                    scope.stPipe(ctrl.tableState(), ctrl);
                                }, config.pipe.delay);

                                return pipePromise;
                            }
                        }
                    },

                    post: function (scope, element, attrs, ctrl) {
                        ctrl.pipe();
                    }
                }
            };
        }]);

})(angular);

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

    var iApp = angular.module("App", ['smart-table'])
        /*.controller('myCtrl', ['$scope', function($scope) {
           // $scope.count = 0;
            $scope.myFunc = function() {
              ///  $scope.count++;
                alert(1)
            };
        }]); */


    iApp.filter('unique', function() {

        return function (arr, field) {
            var o = {}, i, l = arr.length, r = [];
            for(i=0; i<l;i+=1) {
                o[arr[i][field]] = arr[i];
            }
            for(i in o) {
                r.push(o[i]);
            }
            return r;
        };
    })

   /* iApp.directive('myDirective', function() {
        return {
            require: 'ngModel'
        }
    } );  */


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
        $scope.searchVechicelsInAadmin = [];
        $scope.search5 = "Wybierz pakiet...";

        $scope.engineURL = '';
        $scope.engineURL = '';
        $scope.pakiets = '';
        $scope.price = 00;
        $scope.orderedCar = {};
        $scope.myValue = true;
        $scope.model1admin = "none";

        $scope.addingItem=[];

        $scope.removeItem = function removeItem(row) {
            var index = $scope.vehicles.indexOf(row);
            if (index !== -1) {
                $scope.vehicles.splice(index, 1);
            }
        }

        $scope.addRecord = function() {
            $scope.vehicles.push( {"ID": $scope.addingItem.model_id, "mark":  $scope.addingItem.mark, "name":  $scope.addingItem.name, "car_type":  $scope.addingItem.car_type, "body_typ": $scope.addingItem.body_typ } );
            $scope.addingItem=[];
        }


        $scope.filtrujSilnik = function (type,filtr) {
            $scope.engines_end = $scope.engines_mark = $scope.engines_all = filterFilter(orderByFilter($scope.engines, filtr), type);
        }


       // $scope.myFunc = function(e,f) {
            ///  $scope.count++;
           // alert(e+" , "+f)
       // };

        $scope.packsCheckBoxSynchro = function(x) {
            console.log(x);
            x="true"
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
            //$scope.vehicles_end = $scope.vehicles_mark = $scope.vehicles_all =
                $scope.vehicles =response.data.records //= JSON.parse(data);;
        }, function myError(response) {
           alert("E r r o r  1 !");
        });

       /* $http(
            {
                method : "GET",
                url : "./json/engines.json"
            }
        ).then(function mySucces(response) {
            console.log(response.data.records);
            $scope.engines_end = $scope.engines_mark = $scope.engines_all = $scope.engines =response.data.records
        }, function myError(response) {
            alert("E r r o r  1 !");
        });*/

        $scope.engines_end = $scope.engines_mark = $scope.engines_all = $scope.engines =[]




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



        $scope.loadJSONtoScope = function (adress, pack,type) {
            $http(
                {
                    method : "GET",
                    url : adress
                }
            ).then(function mySucces(response) {

                $scope.engines_end = $scope.engines_mark = $scope.engines_all = $scope.engines  = response.data[pack] ;
                document.getElementById(type).disabled = false;
                $scope.engineURL="engine2.html";

                $scope.pakiets="";

                $http(
                    {
                        method : "GET",
                        url : "./json/packs.json?"+pack
                    }
                ).then(

                    function mySucces(response) {
                        $scope.packs =response.data[pack];






                        $http(
                            {
                                method : "GET",
                                url : "./json/wheels.json?"+pack
                            }
                        ).then(function mySucces(response) {
                            $scope.wheels =response.data[pack];
                        }, function myError(response) {
                            alert("E r r o r  56 !");
                        });


                        $http(
                            {
                                method : "GET",
                                url : "./json/colors.json?"+pack
                            }
                        ).then(function mySucces(response) {
                            $scope.color =response.data[pack];
                        }, function myError(response) {
                            alert("E r r o r  1 !");
                        });







                    }, function myError(response) {
                        alert("E r r o r  44 !");
                    });

            }, function myError(response) {
                alert("E r r o r  3 !");
            });
        }

        $scope.showButton1 = function (type, id) {
            $scope.engineURL="";

            $scope.orderedCar.engine_id=id
            $scope.loadJSONtoScope("./json/engines.json?",String(id),type);
		}

         //var pack1="F30";




        $scope.showButton2 = function (type, typ) {


            $scope.orderedCar.typ=typ
            document.getElementById(type).disabled = false;
            $scope.pakiets="pakiety5.html"
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


           // +{{orderedCar.pack_price}} zł

        $scope.setWheelsPrice = function (n) {
            $scope.orderedCar.wheelsPrice=n;

        }


        $scope.countFreePacks = function () {
            $scope.orderedCar.free_pack_price=0;
            for (i = 0; i < $scope.packs.length ; i++) {
               if(  $scope.packs[i].Pakiet !=  $scope.search5 && $scope.packs[i].waluta1=="true") {
                   $scope.orderedCar.free_pack_price = Number($scope.packs[i].price_out) + Number($scope.orderedCar.free_pack_price);
               }
            }
        }

        //$scope.orderedCar.packs_id= 337

        $scope.setPacks = function ( type, pack_price, packs_id ) {
          //  for (var m3 in   $scope.packs) {m3.waluta1=""; m3.abadonAtSumming="yes"}
            $scope.orderedCar.pack_price=pack_price ;

            $scope.orderedCar.packs_id =packs_id

            for (i = 0; i < $scope.packs.length ; i++) {
                $scope.packs[i].waluta1=""; // $scope.packs[i].abadonAtSumming="yes"
            }
           ////// $scope.packs[0].waluta1="";
           // $('input[type=checkbox]').attr('checked',false);
            //$('.resetCheckbox').attr('checked',false);
            //$('.resetCheckbox').attr('ng-model',false);
            $scope.search5=type;

            document.getElementById('button4').disabled = false;
                //alert(type)
            //$scope.packsElements = filterFilter(orderByFilter($scope.packs, "Pakiet"), type);
            // $scope.packsElements =$scope.packs;
        }



        $scope.packsElements=[]
        $scope.packsElementsName=""



        $scope.colourIncludes = [];
        $scope.typ1=""

        $scope.setColorBody = function(colour,colorName) {
            $scope.orderedCar.colour=colour;
            $scope.orderedCar.colorName=colorName;

        }


        $scope.includeColour = function(colour,typ1) {
            $scope.typ1=typ1;
            var i = $.inArray(colour, $scope.colourIncludes);
            if (i > -1) {
                $scope.colourIncludes.splice(i, 1);
            } else {
                $scope.colourIncludes.push(colour);
            }
        }

        $scope.showTable = function(fruit) { }
        $scope.colourFilter = function(fruit) {
            if ($scope.colourIncludes.length > 0) {
                console.log($scope.typ1);
                if ($.inArray(fruit["gear"], $scope.colourIncludes) < 0 && $.inArray(fruit["typ"], $scope.colourIncludes) < 0 && $.inArray(fruit["naped"], $scope.colourIncludes) < 0)
                    return;
            }
            return fruit;
        }


        $scope.list = $scope.$parent.personList
        $scope.config = {
            itemsPerPage: 5,
            fillLastPage: true
        }

    });



