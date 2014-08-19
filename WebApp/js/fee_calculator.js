var feeCalculatorControllers = angular.module('feeCalculator', ['serverResources']);

//Boundaries to loop over
feeCalculatorControllers.boundaries = [
    "hundred_per_boundary",
    "eighty_perc_boundary",
    "seventyfive_perc_boundary",
    "sixty_perc_boundary",
    "fifty_perc_boundary",
    "forty_perc_boundary",
    "thirtythree_perc_boundary",
    "twentyfive_perc_boundary",
    "twenty_perc_boundary"
]

// :: String -> Float
feeCalculatorControllers.boundaryToDiscount = function(boundary){
    switch (boundary){
        case 'hundred_per_boundary':
            return 1.00;
        case 'eighty_perc_boundary':
            return 0.80;
        case 'seventyfive_perc_boundary':
            return 0.75;
        case 'sixty_perc_boundary':
            return 0.60;
        case 'fifty_perc_boundary':
            return 0.50;
        case 'forty_perc_boundary':
            return 0.40;
        case 'thirtythree_perc_boundary':
            return 0.33;
        case 'twenty_perc_boundary':
            return 0.20;
        default:
            return 0.00;
    }

}
feeCalculatorControllers.controller('FeeCalculatorController',
            ['$scope', 'FeeData', function($scope, FeeData) {

                $scope.schoolFeeList = FeeData.query();

                $scope.numberOfFamilyMembers = 5;
                $scope.totalParentIncome = 30325;
                $scope.totalOtherFamilyMemberIncome = 80000;
                $scope.propertyExpense = 12000;
                $scope.totalAssets = 350000;

                $scope.selectedSchool;

                $scope.selectedSchools = {
                    schools : [],
                };

                $scope.prices = {
                    firstChild : {
                        secondarySchool : {
                            Y1 : 0,
                            Y2 : 0,
                            Y3 : 0,
                            Y4 : 0,
                            Y5 : 0,
                            Y6 : 0
                        }
                    }, 
                    followingChildren : {
                        secondarySchool : {
                            Y1 : 0,
                            Y2 : 0,
                            Y3 : 0,
                            Y4 : 0,
                            Y5 : 0,
                            Y6 : 0
                        }
                    }
                };

                $scope.addSchool = function(){
                    $scope.selectedSchools.schools.push({value : $scope.selectedSchool } );
                    $scope.updatePrices();
                }

                $scope.removeSchool = function(school){
                    var index = $scope.selectedSchools.schools.indexOf(school);
                    if (index != -1){
                        $scope.selectedSchools.schools.splice(index, 1);
                    }
                }

                //Watch for changes in disposable income
                $scope.updateDisposableIncome = function(){
                    var family_num = parseInt($scope.numberOfFamilyMembers);
                    var annual_income = parseFloat($scope.totalParentIncome);
                    var other_annual_income = parseFloat($scope.totalOtherFamilyMemberIncome);
                    var property_expense = parseFloat($scope.propertyExpense);
                    var total_assets = parseFloat($scope.totalAssets);

                    $scope.calc_step_a = annual_income;
                    $scope.calc_step_b = other_annual_income * 0.40;
                    $scope.calc_step_c = -property_expense;
                    $scope.calc_step_d = total_assets > 500000 ? (total_assets - 500000)*0.10 : 0;
                    $scope.disposableIncome = 
                        $scope.calc_step_a + 
                        $scope.calc_step_b + 
                        $scope.calc_step_c + 
                        $scope.calc_step_d; 
                    $scope.disposableIncome = $scope.disposableIncome / (family_num + 1)
                    $scope.disposableIncome = $scope.roundToTwoPlaces($scope.disposableIncome);
                    console.log($scope.disposableIncome);
                }

                $scope.roundToTwoPlaces = function(flt){
                    return parseFloat(Math.round(flt * 100) / 100).toFixed(2);
                }

                $scope.updatePrices = function(scope){
                    var disposable_income = parseFloat($scope.disposableIncome);
                    for (var i = 0; i < $scope.selectedSchools.schools.length; ++i){
                        var school = $scope.selectedSchools.schools[i].value;

                        var boundaries = feeCalculatorControllers.boundaries;
                        var discount_boundaries  = school.discount_boundaries;
                        var discount_percent = 0.00;

                        //Calculate the percent of the fee to discount
                        for (var j = 0; j != feeCalculatorControllers.boundaries.length; ++j){
                            var income_level = discount_boundaries[boundaries[j]];
                            if (income_level == -1 ){
                                continue;
                            }
                            if (income_level >= disposable_income) {
                                discount_percent = feeCalculatorControllers.boundaryToDiscount(boundaries[j]);
                                break;
                            }
                        }
                        console.log(discount_percent);

                        //Calculate the prices
                        var price_by_years = school.price_by_years;
                        $scope.selectedSchools.schools[i].value.prices = {
                            firstChild : {
                                secondarySchool : {
                                    Y1 : $scope.roundToTwoPlaces(price_by_years.year_1_price * (1 - discount_percent)),
                                    Y2 : $scope.roundToTwoPlaces(price_by_years.year_2_price * (1 - discount_percent)),
                                    Y3 : $scope.roundToTwoPlaces(price_by_years.year_3_price * (1 - discount_percent)),
                                    Y4 : $scope.roundToTwoPlaces(price_by_years.year_4_price * (1 - discount_percent)),
                                    Y5 : $scope.roundToTwoPlaces(price_by_years.year_5_price * (1 - discount_percent)),
                                    Y6 : $scope.roundToTwoPlaces(price_by_years.year_6_price * (1 - discount_percent))
                                }
                            }
                        };
                        console.log($scope.selectedSchools.schools[i].prices);
                    }
                }
                //Watch for changes in the calculated price
                $scope.$watch( 'disposableIncome' , $scope.updatePrices);

                $scope.updateDisposableIncome();

            }]);
