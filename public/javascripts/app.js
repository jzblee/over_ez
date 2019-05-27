var app = angular.module("over_ez", []); 
app.controller("DigestController", function($scope, $http) {
    $scope.ENTITY_EVENT_SPECIAL = 3420;
    $scope.ENTITY_EVENT_SERVICE = 3421;
    $scope.ENTITY_EVENT_FELLOWSHIP = 3422;
    $scope.ENTITY_COMMITTEE = 3423;

    $scope.getList = function() {
        $http.get("/list")
        .then(
            function(response){ // success
                $scope.server_digest_list = response.data;
            }, 
            function(response){ // failure
                console.log("couldn't get saved digests from server");
            }
        );
    }

    $scope.getList();

    $scope.getDefault = function() {
        $http.get("/get")
        .then(
            function(response){ // success
                $scope.digest = response.data;
            }, 
            function(response){ // failure
                $scope.digest = {
                    "date" : null,
                    "cssFile" : "digest.css",
                    "message" : {
                        "enable" : false,
                        "body" : "",
                        "signoff1" : "In LFS,",
                        "signoff2" : ""
                    },
                    "events" : {
                        "special" : [],
                        "service" : [],
                        "fellowship" : []
                    },
                    "maintainer" : {
                        "name" : "",
                        "nickname" : "",
                        "email" : ""
                    },
                    "svp" : {
                        "name" : "",
                        "nickname" : "",
                        "email" : ""
                    },
                    "fvp" : {
                        "name" : "",
                        "nickname" : "",
                        "email" : ""
                    },
                    "committees" : [],
                    "meetingMinutes" : [],
                    "meetingsUrl" : ""
                }
            }
        );
    }

    $scope.loadDigestDates = function(obj) {
        console.log(obj);
        var userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        obj.date = obj.date ? new Date(new Date(obj.date).getTime() + userTimezoneOffset) : null;
        var digestEventGroupKeys = Object.keys(obj.events);
        for (var i = 0; i < digestEventGroupKeys.length; i++) {
            var eventGroup = obj.events[digestEventGroupKeys[i]];
            for (var j = 0; j < eventGroup.length; j++) {
                eventGroup[j].date_start = eventGroup[j].date_start ? new Date(new Date(eventGroup[j].date_start).getTime() + userTimezoneOffset) : null;
                eventGroup[j].date_end = eventGroup[j].date_end ? new Date(new Date(eventGroup[j].date_end).getTime() + userTimezoneOffset) : null;
                eventGroup[j].time_start = eventGroup[j].time_start ? new Date(new Date(eventGroup[j].time_start).getTime() + userTimezoneOffset) : null;
                eventGroup[j].time_end = eventGroup[j].time_end ? new Date(new Date(eventGroup[j].time_end).getTime() + userTimezoneOffset) : null;
            }
        }
        return obj;
    }

    $scope.saveDigestDates = function(obj) {
        let temp = JSON.parse(JSON.stringify(obj));
        var userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        temp.date = temp.date ? new Date(new Date(temp.date) - userTimezoneOffset) : null;
        var digestEventGroupKeys = Object.keys(temp.events);
        for (var i = 0; i < digestEventGroupKeys.length; i++) {
            var eventGroup = temp.events[digestEventGroupKeys[i]];
            for (var j = 0; j < eventGroup.length; j++) {
                eventGroup[j].date_start = eventGroup[j].date_start ? new Date(new Date(eventGroup[j].date_start) - userTimezoneOffset) : null;
                eventGroup[j].date_end = eventGroup[j].date_end ? new Date(new Date(eventGroup[j].date_end) - userTimezoneOffset) : null;
                eventGroup[j].time_start = eventGroup[j].time_start ? new Date(new Date(eventGroup[j].time_start) - userTimezoneOffset) : null;
                eventGroup[j].time_end = eventGroup[j].time_end ? new Date(new Date(eventGroup[j].time_end) - userTimezoneOffset) : null;
            }
        }
        return temp;
    }

    $scope.loadDigestLocally = function() {
        var temp_text = localStorage.getItem("over_ez_temp");

        // If digest information exists in LocalStorage (i.e. the user
        // clicked "Save" before and has not cleared cookies), load it
        if (temp_text) {
            try {
                let temp_digest = JSON.parse(temp_text);
                $scope.digest = $scope.loadDigestDates(temp_digest);
            }
            catch (err) {
                console.error(err);
            }
        }
        else {
            $scope.getDefault();
        }
    }

    $scope.loadDigestLocally();

    $scope.loadDigestRemotely = function(dateStr) {
        $http.get("/get/" + dateStr)
        .then(
            function(response){ // success
                $scope.digest = $scope.loadDigestDates(response.data);
            }, 
            function(response){ // failure
                console.log("couldn't load saved digests from server - " + dateStr);
            }
        );
    }

    /*
     * Saves all digest details to an entry in browser LocalStorage (cookie)
     */
    $scope.saveDigestLocally = function () {
        try {
            localStorage.setItem("over_ez_temp", JSON.stringify($scope.saveDigestDates($scope.digest)));
        }
        catch(err) {
            console.error(err);
            localStorage.removeItem("over_ez_temp");
        }
    }

    $scope.saveDigestRemotely = function () {
        $http.post("/save", $scope.saveDigestDates($scope.digest))
            .then(
                function(response){ // success
                    console.log("successfully saved digest to server");
                    localStorage.removeItem("over_ez_temp");
                    $scope.getList();

                }, 
                function(response){ // failure
                    console.log("couldn't save digest to server");
                }
            );
    }

    /*
     * Adds a blank item to the model.
     *
     * type: an integer value specifying the type of event
     *       that the new entry should be listed as
     */
    $scope.addItem = function (type) {
        switch (type) {
            case $scope.ENTITY_EVENT_SPECIAL:
                $scope.digest.events.special.push({});
                break;
            case $scope.ENTITY_EVENT_SERVICE:
                $scope.digest.events.service.push({});
                break;
            case $scope.ENTITY_EVENT_FELLOWSHIP:
                $scope.digest.events.fellowship.push({});
                break;
            case $scope.ENTITY_COMMITTEE:
                $scope.digest.committees.push({});
                break;
            default:
                break;
        }
    } 

    /*
     * Shows or hides a prompt to delete some item from the model.
     *
     * type:          an integer value specifying the type of the targeted item
     * index:         the index of the target item within the array that corresponds
     *                to the the given type
     * displayPrompt: a boolean variable; show the prompt if true, hide if false
     */
    $scope.removeItemPrompt = function (type, index, displayPrompt) {
        var entityArr = null;
        switch (type) {
            case $scope.ENTITY_EVENT_SPECIAL:
                entityArr = $scope.digest.events.special;
                break;
            case $scope.ENTITY_EVENT_SERVICE:
                entityArr = $scope.digest.events.service;
                break;
            case $scope.ENTITY_EVENT_FELLOWSHIP:
                entityArr = $scope.digest.events.fellowship;
                break;
            case $scope.ENTITY_COMMITTEE:
                entityArr = $scope.digest.committees;
                break;
            default:
                break;
        }
        entityArr[index]._toRemove = displayPrompt;
    }

    /*
     * Deletes an item from the model (if the user confirms the delete prompt)
     *
     * type:          an integer value specifying the type of the targeted item
     * index:         the index of the target item within the array that corresponds
     *                to the the given type
     */
    $scope.removeItem = function (type, index) {
        var entityArr = null;

        switch (type) {
            case $scope.ENTITY_EVENT_SPECIAL:
                entityArr = $scope.digest.events.special;
                break;
            case $scope.ENTITY_EVENT_SERVICE:
                entityArr = $scope.digest.events.service;
                break;
            case $scope.ENTITY_EVENT_FELLOWSHIP:
                entityArr = $scope.digest.events.fellowship;
                break;
            case $scope.ENTITY_COMMITTEE:
                entityArr = $scope.digest.committees;
                break;
            default:
                break;
        }
        entityArr.splice(index, 1);
    }
})
.directive("outputEvent", function() {
    return {
        templateUrl: function(elem, attr) {
            return 'templates/output-event.html';
        }
    };
});
