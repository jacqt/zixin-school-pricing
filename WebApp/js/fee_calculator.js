var feeCalculatorControllers = angular.module('feeCalculator', ['serverResources']);

feeCalculatorControllers.boundaries = [
    "hundred_per_boundary",
    "eighty_perc_boundary",
    "seventyfive_perc_boundary",
    "sixty_perc_boundary",
    "fifty_perc_boundary",
    "forty_perc_boundary",
    "thirtythree_perc_boundary",
    "twentyfive_perc_boundary" 
    "twenty_perc_boundary",
]

// :: String -> Float
feeCalculator.boundaryToDiscount = function(boundary){
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

                $scope.numberOfFamilyMembers = 0;
                $scope.totalParentIncome = 0;
                $scope.totalOtherFamilyMemberIncome = 0;
                $scope.propertyExpense = 0;
                $scope.totalAssets = 0;
                $scope.disposableIncome = 0;

                $scope.selectedSchool;
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

                //Watch for changes in disposable income
                $scope.$watchGroup([
                    'numberOfFamilyMembers',
                    'totalParentIncome',
                    'totalOtherFamilyMemberIncome',
                    'propertyExpense',
                    'totalAssets' ], function(newValues, oldValues, scope){
                        var family_num = parseInt(newValues[0]);
                        var annual_income = parseInt(newValues[1]);
                        var other_annual_income = parseInt(newValues[2]);
                        var property_expense = parseInt(newValues[3]);
                        var total_assets = parseInt(newValues[4]);

                        $scope.calc_step_a = annual_income;
                        $scope.calc_step_b = other_annual_income * 0.40;
                        $scope.calc_step_c = -property_expense;
                        $scope.calc_step_d = total_assets > 500000 ? (total_assets - 500000)*0.10 : 0;
                        $scope.disposableIncome = 
                            $scope.calc_step_a + 
                            $scope.calc_step_b + 
                            $scope.calc_step_c + 
                            $scope.calc_step_d; 
                        $scope.disposableIncome = 
                            parseFloat(Math.round($scope.disposable_income * 100) / 100).toFixed(2);
                    }
                );
                //Watch for changes in the calculated price
                $scope.$watchGroup([
                        'selectedSchool',
                        'disposableIncome'
                        ], function(newValues, oldValues, scope){
                            var selected_school = parseInt(newValues[0]);
                            var disposable_income = parseInt(newValues[1]);

                            var boundaries = feeCalculatorControllers.boundaries;
                            var discount_boundaries  = selected_school.discount_boundaries;
                            var discount_percent;

                            //Calculate the percent of the fee to discount
                            for (var i = 0; i != feeCalculatorControllers.boundaries; ++i){
                                var income_level = discount_boundaries[boundaries[i]];
                                if (income_level == -1 ){
                                    continue;
                                }
                                if (income_level >= disposable_income) {
                                    discount_percent = feeCalculatorControllers.boundaryToDiscount(boundaries[i]);
                                    break;
                                }
                            }

                            var price_by_years = selected_school.price_by_years;
                            $scope.year_1_price = price_by_years.year_1_price * discount_percent;
                            $scope.year_2_price = price_by_years.year_2_price * discount_percent;
                            $scope.year_3_price = price_by_years.year_3_price * discount_percent;
                            $scope.year_4_price = price_by_years.year_4_price * discount_percent;
                            $scope.year_5_price = price_by_years.year_5_price * discount_percent;
                            $scope.year_6_price = price_by_years.year_6_price * discount_percent;
                        });

            }]);
