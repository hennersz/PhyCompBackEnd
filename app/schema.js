var express = require('express');
var routes = require('../routes');


//Returns schema data from the datasets: 
// 1: OpenAir API
// 2: Intel SmartCitizen API
// 3: Data.Gov  / OpenAQ

exports.schema = function schema (data1, data2, data3) {

	var collated1 = [], collated2 = [], collated3 = [];

	data1.HourlyAirQualityIndex.LocalAuthority.forEach( function(element, index) {
		collated1.push(returnSiteData(element));
	});

	data2.forEach( function(element, index) {
		collated2.push(element);
	});

}

exports.collate = function collate (data1, data2, data3) {

	data1.forEach( function(element1, index) {
		data2.array.forEach( function(element2, index) {
			if(element1.latitude)
		});
	});
}

// Computes the Haversine Formula on the 2 location points
exports.haversine = function haversine (lat1, lon1, lat2, lon2) {

    function toRad(x) {
        return (x * (Math.PI / 180));
    }
    var R = 6731; //KM
    var dlat = toRad(lat2 - lat1), dlon = toRad(lon2 - lon1);
    var a = (sin(dlat / 2))^2 + cos(lat2) * (sin(dlon/2))^2;
    var c = 2 * atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
}

exports.site = function returnSiteData(data) {

    var reponse = {
        "siteName": data.@SiteName, //	OpenAir Site Name
        "latitude": data.@Latitude, //	OpenAir Site latitude
        "longitude": data.@Longitude, //	OpenAir Site longitude
        "data": []
    };
    var species = [];
    if (data.Species !== undefined) {
        species = checkSpecies(data.Species);
        species.forEach(function(element, index) {
            switch (element) {
                case "NO2":
                    data.Species.forEach(function(element, index) {
                        if (element.@SpeciesCode == "NO2") {
                            reponse.data.push({
                                "no2": +element.@AirQualityIndex
                            });
                        }
                    });
                    break;
                case "O3":
                    data.Species.forEach(function(element, index) {
                        if (element.@SpeciesCode == "O3") {
                            reponse.data.push({
                                "o3": +element.@AirQualityIndex
                            });
                        }
                    });
                    break;
                case "SO2":
                    data.Species.forEach(function(element, index) {
                        if (element.@SpeciesCode == "SO2") {
                            reponse.data.push({
                                "so2": +element.@AirQualityIndex
                            });
                        }
                    });
                    break;
                case "PM10":
                    data.Species.forEach(function(element, index) {
                        if (element.@SpeciesCode == "PM10") {
                            reponse.data.push({
                                "pm10": +element.@AirQualityIndex
                            });
                        }
                    });
                    break;
                case "PM25":
                    data.Species.forEach(function(element, index) {
                        if (element.@SpeciesCode == "PM25") {
                            reponse.data.push({
                                "pm25": +element.@AirQualityIndex
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

exports.device = function returnDeviceData(data) {

    return {
        "deviceID": data.id, //	Intel SmartCitizen Device ID
        "latitude": data.data.location.latitude, //	Intel SmartCitizen Latitude
        "longitude": data.data.location.longitude, //	Intel SmartCitizen Longitude
        "city": data.data.location.city, //	Intel SmartCitizen City (should be London)
        "data": [{
                "light": data.data.sensors[0].value
            }, //	Intel SmartCitizen value for ambient light (Lux)
            {
                "no2": data.data.sensors[4].value
            }, //	Intel SmartCitizen value for NO2 (KOhm / parts per million)
            {
                "co": data.data.sensors[5].value
            }, //	Intel SmartCitzien value for CO (KOhm / parts per million)
            {
                "noise": data.data.sensors[7].value
            } //	Intel SmartCitizen value for ambient Noise (decibels)
        ]
    }

}

exports.checkspecies = function checkSpecies(data) {

    var response = [];

    data.forEach(function(element, index) {
        reponse.push(element.@SpeciesCode);
    });
    return response;
}
