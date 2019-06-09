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
                $scope.showFailure(response.data);
                console.log("couldn't get saved digests from server");
            }
        );
    }

    $scope.getList();

    $scope.getDefault = function() {
        $http.get("/get")
        .then(
            function(response){ // success
                $scope.digest = $scope.loadDigestDates(response.data);
            }, 
            function(response){ // failure
                $scope.showFailure(response.data);
                console.error("couldn't get default digest information from server, using local hardcoded defaults")
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

    /*
     * HTML date and time fields attempt to convert the entered date or
     * time into the local time zone. As the dates and times that are
     * entered will always be in Eastern Time (for RPI's campus), it's
     * not necessary to support multiple time zones. By adding the
     * current local time offset to UTC when loading digest information
     * and subtracting it when saving digest information, we ensure that
     * users sees dates and times in Eastern Time wherever they are.
     */
    $scope.loadDigestDates = function(obj) {
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
        // Clone the object to avoid making changes to the scope variable.
        // This means that field values in the view won't suddenly change
        // after saving.
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
        if (temp_text && temp_text != "ignore") {
            try {
                let temp_digest = JSON.parse(temp_text);
                $scope.digest = $scope.loadDigestDates(temp_digest);
            }
            catch (err) {
                $scope.showFailure(err);
                console.error("couldn't load saved digest from LocalStorage");
            }
        }
        else if (!temp_text) {
            $scope.getDefault();
        }
    }

    $scope.loadDigestLocally();

    $scope.loadDigestRemotely = function(dateStr) {
        $http.get("/get/" + dateStr)
        .then(
            function(response){ // success
                $scope.digest = $scope.loadDigestDates(response.data);
                var event = new Event('DigestLoaded');

                // Dispatch the event.
                document.dispatchEvent(event);
            }, 
            function(response){ // failure
                $scope.showFailure(response.data);
                console.error("couldn't load saved digest from server - " + dateStr);
            }
        );
    }

    /*
     * Saves all digest details to an entry in browser LocalStorage
     */
    $scope.saveDigestLocally = function () {
        try {
            $scope.showSuccess();
            localStorage.setItem("over_ez_temp", JSON.stringify($scope.saveDigestDates($scope.digest)));
        }
        catch(err) {
            $scope.showFailure(err);
            localStorage.removeItem("over_ez_temp");
        }
    }

    /*
     * Saves all digest details to the server (the way the POST request
     * is defined, the server will overwrite a database entry if it has
     * a matching date)
     */
    $scope.saveDigestRemotely = function (callback) {
        var digest = $scope.saveDigestDates($scope.digest);
        $http.post("/save", digest)
            .then(
                function(response){ // success
                    localStorage.removeItem("over_ez_temp");
                    $scope.getList();
                    if (callback) {
                        callback(digest.date.toISOString().substr(0,10));
                    }
                    else {
                        console.log("successfully saved digest to server");
                        $scope.showSuccess();
                    }

                }, 
                function(response){ // failure
                    console.error("couldn't save digest to server");
                    $scope.showFailure(response.data);
                }
            );
    }

    $scope.publishDigest = function (date) {
        $http.post("/render/" + date)
            .then(
                function(response){ // success
                    console.log("successfully published digest");
                    $scope.showSuccess();

                }, 
                function(response){ // failure
                    console.error("couldn't publish digest");
                    $scope.showFailure(response.data);
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

    $scope.showSuccess = function() {
        $("#successModal").modal("show");
        setTimeout(function() {
          $("#successModal").modal("hide");
        }, 3000);
    }

    $scope.showFailure = function(err) {
        $("#failureModal").modal("show");
        setTimeout(function() {
          $("#failureModal").modal("hide");
        }, 3000);
        console.error(err);
    }
})
.directive("outputEvent", function() {
    return {
        templateUrl: function(elem, attr) {
            return '/templates/output-event.html';
        }
    };
});
