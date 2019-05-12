var app = angular.module("over_ez", []); 
app.controller("DigestController", function($scope) {
    $scope.ENTITY_EVENT_SPECIAL = 3420;
    $scope.ENTITY_EVENT_SERVICE = 3421;
    $scope.ENTITY_EVENT_FELLOWSHIP = 3422;
    $scope.ENTITY_COMMITTEE = 3423;

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

    var config_text = localStorage.getItem("config");

    if (config_text) {
        $scope.digest = JSON.parse(config_text);
        $scope.digest.date = $scope.digest.date ? new Date($scope.digest.date) : null;
        var digestEventGroupKeys = Object.keys($scope.digest.events);
        for (var i = 0; i < digestEventGroupKeys.length; i++) {
            var eventGroup = $scope.digest.events[digestEventGroupKeys[i]];
            for (var j = 0; j < eventGroup.length; j++) {
                eventGroup[j].date_start = eventGroup[j].date_start ? new Date(eventGroup[j].date_start) : null;
                eventGroup[j].date_end = eventGroup[j].date_end ? new Date(eventGroup[j].date_end) : null;
                eventGroup[j].time_start = eventGroup[j].time_start ? new Date(eventGroup[j].time_start) : null;
                eventGroup[j].time_end = eventGroup[j].time_end ? new Date(eventGroup[j].time_end) : null;
            }
        }
    }

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

    $scope.saveDigestLocally = function () {
        localStorage.setItem("config", JSON.stringify($scope.digest));
    }
});
