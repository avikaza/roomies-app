angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, fireBaseData, $firebase) {
      $scope.expenses = $firebase(fireBaseData.refExpenses()).$asArray();
        $scope.user = fireBaseData.ref().getAuth();
      //ADD MESSAGE METHOD
      $scope.addExpense = function(e) {
          $scope.expenses.$add({
            by: $scope.user.password.email,
            label: $scope.label,
              cost: $scope.cost
          });
          $scope.label = "";
          $scope.cost = 0;
      };
        $scope.byFilter = $scope.user.password.email;
        $scope.getTotal = function () {
            var i, rtnTotal = 0;
            for (i = 0; i < $scope.expenses.length; i = i + 1) {
                rtnTotal = rtnTotal + $scope.expenses[i].cost;
            }
            return rtnTotal;
        };
})
.controller('FriendsCtrl', function($scope, fireBaseData, $firebase) {
        $scope.user = fireBaseData.ref().getAuth();
        $scope.expenses = $firebase(fireBaseData.refExpenses()).$asArray();
        fireBaseData.refRoomMates().on("value", function(snapshot) {
            var i, objKeysArr = Object.keys(snapshot.val()), roomiesEmailsArr;
            for (i = 0; i < objKeysArr.length; i = i + 1) {
                roomiesEmailsArr = snapshot.val()[objKeysArr[i]];
                //TODO: this code only works for two room mates (being lazy)
                if (roomiesEmailsArr[0] === $scope.user.password.email) {
                    $scope.roomiesEmail = roomiesEmailsArr[1];
                } else if (roomiesEmailsArr[1] === $scope.user.password.email) {
                    $scope.roomiesEmail = roomiesEmailsArr[0];
                }
                //TODO: got to break after the correct roommate set is found (being lazy)
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        $scope.filterBy = {by:$scope.roomiesEmail};
        $scope.addExpense = function(e) {
            $scope.expenses.$add({
                by: $scope.roomiesEmail,
                label: $scope.label,
                cost: $scope.cost
            });
            $scope.label = "";
            $scope.cost = 0;
        };
        $scope.getTotal = function () {
            var i, rtnTotal = 0;
            for (i = 0; i < $scope.expenses.length; i = i + 1) {
                rtnTotal = rtnTotal + $scope.expenses[i].cost;
            }
            return rtnTotal;
        };
})
.controller('AccountCtrl', function($scope, fireBaseData) {
        $scope.showLoginForm = false;
        //Checking if user is logged in
        $scope.user = fireBaseData.ref().getAuth();
        if (!$scope.user) {
            $scope.showLoginForm = true;
        }
        //Login method
        $scope.login = function (em, pwd) {
            fireBaseData.ref().authWithPassword({
                email    : em,
                password : pwd
            }, function(error, authData) {
                if (error === null) {
                    console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
                    $scope.user = fireBaseData.ref().getAuth();
                    $scope.showLoginForm = false;
                    //fireBaseData.refRoomMates().push(["k@gmail.com","r@gmail.com"]);
                } else {
                    console.log("Error authenticating user:", error);
                }
            });
        };
        //Logout method
        $scope.logout = function () {
            fireBaseData.ref().unauth();
            $scope.showLoginForm = true;
        };
});