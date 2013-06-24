'use strict';

angular.module('indexedExApp')
.controller('MainCtrl', function ($scope) {
    $scope.items = '';

    var initCallback = function(){
        getItems();
    };

    var dataStore = new IDBStore('todos', initCallback);

    var getItemsSuccess = function(data){
        $scope.items = data;
        // http://jimhoskins.com/2012/12/17/angularjs-and-apply.html 
        $scope.$apply(); 
    };

    var errorCallback = function(){
        console.log('error'); 
    };

    var getItems = function(){
        dataStore.getAll(getItemsSuccess,errorCallback);
        console.log('getItems'); 
    };

    $scope.deleteItem = function(item){
        dataStore.remove(item,getItems,errorCallback);
    }

    $scope.addItem = function(){
        dataStore.put({'timeStamp': new Date().getTime(), 'text' : $scope.itemname},getItems,errorCallback); 
        $scope.itemname = ''; 
    };
});
