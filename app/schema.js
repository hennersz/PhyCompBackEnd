var express = require('express');
var routes = require('../routes');


//Returns schema data from the datasets: 
// 1: OpenAir API
// 2: Intel SmartCitizen API
// 3: Data.Gov  / OpenAQ

// Scheme function takes the appropriate data from the api and gets the simplified information that should be used for the response
exports.schema = function schema (data1, data2, data3) {

    var collated1 = [], collated2 = [], collated3 = [];
    // Standardized OpenAir Data
    data1.LocalAuthority.forEach( function(element1, index) {
        if(element1.Site !== undefined) {
            if(Object.prototype.toString.call(element1.Site.Species) === '[object Array]'){
                element1.Site.Species.forEach( function(element2, index) {
                    collated1.push(returnSiteData(element2));
                });                
            }
        }
    });

    // Standardized Intel SmartCitizen Data

    data2.forEach( function(element, index) {
        if(element.data.sensors.length >= 1){
            collated2.push(returnDeviceData(element));
        }
    });

    // Standardized OpenAQ Data

    data3.results.forEach( function(element, index) {
        collated3.push(returnLocationData(element));
    });

    collated2 = collated2.concat(collated3);
    return collated1;
}

function returnSiteData(data) {
    var response = {
        "siteName": data['@SiteName'], //  OpenAir Site Name
        "datetime" : data['@BulletinDate'],
        "latitude": data['@Latitude'], //  OpenAir Site latitude
        "longitude": data['@Longitude'], //    OpenAir Site longitude
        "data": []
    };
    var species = [];
    if (data.Species !== undefined) {
        species = checkSpecies(data);
        species.forEach(function(element, index) {
            switch (element) {
                case "NO2":
                    data.Species.forEach(function(element, index) {
                        if (element['@SpeciesCode'] == "no2") {
                            reponse.data.push({
                                "no2": element['@AirQualityIndex']
                            });
                        }
                    });
                    break;
                case "O3":
                    data.Species.forEach(function(element, index) {
                        if (element['@SpeciesCode'] == "o3") {
                            reponse.data.push({
                                "o3": element['@AirQualityIndex']
                            });
                        }
                    });
                    break;
                case "SO2":
                    data.Species.forEach(function(element, index) {
                        if (element['@SpeciesCode'] == "so2") {
                            reponse.data.push({
                                "so2": element['@AirQualityIndex']
                            });
                        }
                    });
                    break;
                case "PM10":
                    data.Species.forEach(function(element, index) {
                        if (element['@SpeciesCode'] == "pm10") {
                            reponse.data.push({
                                "pm10": element['@AirQualityIndex']
                            });
                        }
                    });
                    break;
                case "PM25":
                    data.Species.forEach(function(element, index) {
                        if (element['@SpeciesCode'] == "pm25") {
                            reponse.data.push({
                                "pm25": element['@AirQualityIndex']
                            });
                        }
                    });
                    break;
                default:
                    break;
            }
        });
        return response;
    }

}

function returnDeviceData(data) {
    return {
        "deviceID" : data.id, //    Intel SmartCitizen Device ID
        "latitude" : data.data.location.latitude, //    Intel SmartCitizen Latitude
        "longitude" : data.data.location.longitude, //  Intel SmartCitizen Longitude
        "datetime" : data.last_reading_at,
        "data": [{
                "light": data.data.sensors[0].value
            }, //   Intel SmartCitizen value for ambient light (Lux)
            {
                "no2": data.data.sensors[4].value
            }, //   Intel SmartCitizen value for NO2 (KOhm / parts per million)
            {
                "co": data.data.sensors[5].value
            }, //   Intel SmartCitzien value for CO (KOhm / parts per million)
            {
                "noise": data.data.sensors[7].value
            } //    Intel SmartCitizen value for ambient Noise (decibels)
        ]
    }

}

function returnLocationData(data) {

    var responseData = {
        "location" : data.location,
        "latitude" : data.coordinates.latitude,
        "longitude" : data.coordinates.longitude,
        "datetime" : null,
        "data" : []
    }
    var latestDate = "";
    data.measurements.forEach( function(element, index) {
        var par = element.parameter;
        responseData.data.push({
            par : element.value
        });
        if(latestDate !== element.lastUpdated) {
            latestDate = element.lastUpdated;
        }
    });
    responseData.datetime = latestDate;
    return responseData;
}


function checkSpecies(data) {

    var responseData = [];
    if(data.Species.length > 1){
        data.Species.forEach(function(element, index) {
            responseData.push(element['@SpeciesCode']);
        });                
    } else {
        responseData.push(data.Species['@SpeciesCode']);
    }
    return responseData;

}
