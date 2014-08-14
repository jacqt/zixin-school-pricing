var feeCalculatorControllers = angular.module('feeCalculator', ['serverResources']);

feeCalculatorControllers.controller('FeeCalculatorController',
            ['$scope', 'FeeData', function($scope, FeeData) {

                $scope.schoolFeeList = FeeData.query();
                $scope.selectedSchool;
                $scope.numberOfFamilyMembers = 0;
                $scope.totalParentIncome = 0;
                $scope.totalOtherFamilyMemberIncome = 0;
                $scope.propertyExpense = 0;
                $scope.totalAssets = 0;
                $scope.calc_final = 0;
                $scope.$watchGroup([
                    'selectedSchool',
                    'numberOfFamilyMembers',
                    'totalParentIncome',
                    'totalOtherFamilyMemberIncome',
                    'propertyExpense',
                    'totalAssets' ], function(newValues, oldValues, scope){
                        var family_num = parseInt(newValues[1]);
                        var annual_income = parseInt(newValues[2]);
                        var other_annual_income = parseInt(newValues[3]);
                        var property_expense = parseInt(newValues[4]);
                        var total_assets = parseInt(newValues[5]);

                        $scope.calc_step_a = annual_income;
                        $scope.calc_step_b = other_annual_income * 0.40;
                        $scope.calc_step_c = -property_expense;
                        $scope.calc_step_d = total_assets > 500000 ? (total_assets - 500000)*0.10 : 0;
                        $scope.disposable_income = 
                            $scope.calc_step_a + 
                            $scope.calc_step_b + 
                            $scope.calc_step_c + 
                            $scope.calc_step_d; 
                        $scope.disposable_income = 
                            parseFloat(Math.round($scope.disposable_income * 100) / 100).toFixed(2);
                    }
                );

            }]);
