var app = angular.module("over_ez", []); 
app.controller("DigestController", function($scope, $http) {
    $scope.ENTITY_EVENT_SPECIAL = 3420;
    $scope.ENTITY_EVENT_SERVICE = 3421;
    $scope.ENTITY_EVENT_FELLOWSHIP = 3422;
    $scope.ENTITY_COMMITTEE = 3423;

    $scope.daysOfWeek = [
        { value: 0, label: "...the next Sunday" },
        { value: 1, label: "...the next Monday" },
        { value: 2, label: "...the next Tuesday" },
        { value: 3, label: "...the next Wednesday" },
        { value: 4, label: "...the next Thursday" },
        { value: 5, label: "...the next Friday" },
        { value: 6, label: "...the next Saturday" }
    ]

    $scope.page = {
        showAllInOpen: false
    }

    /*
     * Get a list of digests saved to the server.
     */
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

    /*
     * Get the default digest configuration from the server.
     */
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
     * users see dates and times in Eastern Time wherever they are.
     *
     * obj: digest object to convert the dates of
     */
    $scope.loadDigestDates = function(obj) {
        var userTimezoneOffset = new Date(obj ? obj.date : null).getTimezoneOffset() * 60000;
        obj.date = obj.date ? new Date(new Date(obj.date).getTime() + userTimezoneOffset) : null;
        var digestEventGroupKeys = Object.keys(obj.events);
        for (var i = 0; i < digestEventGroupKeys.length; i++) {
            var eventGroup = obj.events[digestEventGroupKeys[i]];
            for (var j = 0; j < eventGroup.length; j++) {
                userTimezoneOffset = new Date(eventGroup[j].date_start).getTimezoneOffset() * 60000;
                eventGroup[j].date_start = eventGroup[j].date_start ? new Date(new Date(eventGroup[j].date_start) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].date_end).getTimezoneOffset() * 60000;
                eventGroup[j].date_end = eventGroup[j].date_end ? new Date(new Date(eventGroup[j].date_end) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].time_start).getTimezoneOffset() * 60000;
                eventGroup[j].time_start = eventGroup[j].time_start ? new Date(new Date(eventGroup[j].time_start) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].time_end).getTimezoneOffset() * 60000;
                eventGroup[j].time_end = eventGroup[j].time_end ? new Date(new Date(eventGroup[j].time_end) - userTimezoneOffset) : null;
            }
        }
        return obj;
    }

    /*
     * Similar to loadDigestDates, but clones the object
     *
     * obj: digest object to convert the dates of
     */
    $scope.saveDigestDates = function(obj) {
        // Clone the object to avoid making changes to the scope variable.
        // This means that field values in the view won't suddenly change
        // after saving.
        let temp = JSON.parse(JSON.stringify(obj));
        var userTimezoneOffset = new Date(temp ? temp.date : null).getTimezoneOffset() * 60000;
        temp.date = temp.date ? new Date(new Date(temp.date) - userTimezoneOffset) : null;
        var digestEventGroupKeys = Object.keys(temp.events);
        for (var i = 0; i < digestEventGroupKeys.length; i++) {
            var eventGroup = temp.events[digestEventGroupKeys[i]];
            for (var j = 0; j < eventGroup.length; j++) {
                userTimezoneOffset = new Date(eventGroup[j].date_start).getTimezoneOffset() * 60000;
                eventGroup[j].date_start = eventGroup[j].date_start ? new Date(new Date(eventGroup[j].date_start) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].date_end).getTimezoneOffset() * 60000;
                eventGroup[j].date_end = eventGroup[j].date_end ? new Date(new Date(eventGroup[j].date_end) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].time_start).getTimezoneOffset() * 60000;
                eventGroup[j].time_start = eventGroup[j].time_start ? new Date(new Date(eventGroup[j].time_start) - userTimezoneOffset) : null;
                userTimezoneOffset = new Date(eventGroup[j].time_end).getTimezoneOffset() * 60000;
                eventGroup[j].time_end = eventGroup[j].time_end ? new Date(new Date(eventGroup[j].time_end) - userTimezoneOffset) : null;
            }
        }
        return temp;
    }

    /*
     * Load digest information if it exists in LocalStorage (i.e. the user
     * clicked "Save to my computer" before and has not cleared cookies).
     */
    $scope.loadDigestLocally = function() {
        var temp_text = localStorage.getItem("over_ez_temp");

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

    // Load whatever's in local storage on page load
    $scope.loadDigestLocally();

    /*
     * Load digest details from the server.
     * 
     * This function sends an event, DigestLoaded, to notify jsdom
     * of completion for serverside rendering tasks. By listening
     * for this event, the plugin will know when the HTML is done
     * generating in order to attach it to an email.
     *
     * dateStr: formatted date string (yyyy-MM-dd)
     */
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
     *
     * callback: optional function to run on success (usually publishDigest)
     */
    $scope.saveDigestRemotely = function (callback) {
        var digest = $scope.saveDigestDates($scope.digest);
        $http.post("/save", digest)
            .then(
                function(response){ // success
                    localStorage.removeItem("over_ez_temp");
                    $scope.getList();
                    if (callback) {
                        setTimeout(function() {
                            callback(digest.date.toISOString().substr(0,10));
                        }, 250);
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

    /*
     * Publishes digest via email.
     *
     * dateStr: formatted date string (yyyy-MM-dd)
     */
    $scope.publishDigest = function (dateStr) {
        $scope.publishing = true;
        $http.post("/render/" + dateStr)
            .then(
                function(response){ // success
                    $("#publishModal").modal("hide");
                    setTimeout(function() {
                        $scope.publishing = false;
                    }, 250);
                    console.log("successfully published digest");
                    $scope.showSuccess();

                }, 
                function(response){ // failure
                    $("#publishModal").modal("hide");
                    setTimeout(function() {
                        $scope.publishing = false;
                    }, 250);
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

    /*
     * Sets an event's start or end date to some date in the next week.
     *
     * type:       an integer value specifying the type of the targeted item
     * index:      the index of the target item within the array that corresponds
     *             to the the given type
     * setEndDate: a boolean variable; show the end date if true, set the start date if false
     * value:      an integer denoting which day of the week to set the event to
     */
    $scope.setEventDate = function (type, index, setEndDate, value) {
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

        let today = new Date(Date.now());

        let newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // advance 1 day first
        newDate.setDate(newDate.getDate() + 1);

        while (newDate.getDay() != value) {
          newDate.setDate(newDate.getDate() + 1);
        }
        if (setEndDate) {
            entityArr[index].date_end = newDate;
        } else {
            entityArr[index].date_start = newDate;
        }
    }

    $scope.showSuccess = function(message) {
        $("#successModal").modal("show");
    }

    $scope.showFailure = function(err) {
        $("#failureModal").modal("show");
        console.error(err);
    }

    $scope.showPublishModal = function() {
        $http.get("/publishEmail")
        .then(
            function(response){ // success
                $scope.emailTo = response.data.emailTo;
                $("#publishModal").modal("show");
            }, 
            function(response){ // failure
                $scope.showFailure(response.data);
                console.log("couldn't get publish email address");
            }
        );
    }
})
.directive("outputEvent", function() {
    return {
        templateUrl: function(elem, attr) {
            return '/templates/output-event.html';
        }
    };
})
.directive("editorEvent", function() {
    return {
        restrict: 'E',
        scope: true,
        link: function(scope, element, attrs) {
            scope.type = parseInt(attrs.type);
            scope.eventIndex = parseInt(attrs.index);
        },
        templateUrl: function(elem, attr) {
            return '/templates/editor-event.html';
        }
    };
});
