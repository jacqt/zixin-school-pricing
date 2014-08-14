var feeCalculatorControllers = angular.module('feeCalculator', ['serverResources']);

feeCalculatorControllers.controller('FeeCalculatorController',
            ['$scope', 'FeeData', function($scope, FeeData) {
                $scope.SchoolFeeList = FeeData.query();
                $scope.SelectedSchool;

            }]);
