'use strict';

var indexedex = {
    indexedDB : {}
};

(function(){
    indexedex.indexedDB.db = null;

    indexedex.indexedDB.open = function() {
        var version = 1;
        var request = indexedDB.open("todos", version);

        // We can only create Object stores in a versionchange transaction.
        request.onupgradeneeded = function(e) {
            var db = e.target.result;

            // A versionchange transaction is started automatically.
            e.target.transaction.onerror = html5rocks.indexedDB.onerror;

            if(db.objectStoreNames.contains("todo")) {
                db.deleteObjectStore("todo");
            }

            var store = db.createObjectStore("todo",
            {keyPath: "timeStamp"});
        };


        reeuest.onsuccess = function(e) {
            indexedex.indexedDB.db = e.target.result;
            indexedex.indexedDB.getAllTodoItems();
        };

        request.onerror = indexedex.indexedDB.onerror;
    };

    indexedex.indexedDB.open();
})();

indexedex.indexedDB.addTodo = function(todoText) {
    var db = indexedex.indexedDB.db;
    var trans = db.transaction(["todo"], "readwrite");
    var store = trans.objectStore("todo");
    var request = store.put({
        "text": todoText,
        "timeStamp" : new Date().getTime()
    });

    request.onsuccess = function(e) {
        indexedex.indexedDB.getAllTodoItems();
    };

    request.onerror = function(e) {
        console.log(e.value);
    };
};

indexedex.indexedDB.getAllTodoItems = function(successCallback) {
    var todos = document.getElementById("todoItems");
    todos.innerHTML = "";

    var db = indexedex.indexedDB.db;
    var trans = db.transaction(["todo"], "readwrite");
    var store = trans.objectStore("todo");

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false)
            return;
        result.continue();
    };

    cursorRequest.onerror = html5rocks.indexedDB.onerror;
};


