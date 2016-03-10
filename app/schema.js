var express = require('express');
var routes = require('../routes');
//Returns schema data from the datasets: 
// 1: OpenAir API
// 2: Intel SmartCitizen API
// 3: Data.Gov  / OpenAQ
// Scheme function takes the appropriate data from the api and gets the simplified information that should be used for the response

exports.schema = function schema(data1, data2, data3) {
    var collated1 = [],
        collated2 = [],
        collated3 = [];
    // Standardized OpenAir Data
    data1.LocalAuthority.forEach(function(element1, index) {
        if (element1.Site !== undefined) {
            if (Array.isArray(element1.Site)) {
                element1.Site.forEach(function(element2, index) {
                    collated1.push(returnSiteData(element2));
                });
            } else {
                collated1.push(returnSiteData(element1.Site));
            }
        }
    });
    // Standardized Intel SmartCitizen Data
    data2.forEach(function(element, index) {
        if (element.data.sensors.length >= 1) {
            collated2.push(returnDeviceData(element));
        }
    });
    // Standardized OpenAQ Data
    data3.results.forEach(function(element, index) {
        collated3.push(returnLocationData(element));
    });
    collated2 = collated2.concat(collated3);
    return collated1.concat(collated2);
}

function returnSiteData(data) {
    var response = {
        "siteName": data['@SiteName'], //  OpenAir Site Name
        "datetime": data['@BulletinDate'],
        "latitude": data['@Latitude'], //  OpenAir Site latitude
        "longitude": data['@Longitude'], //    OpenAir Site longitude
        "data": []
    };
    var species = [];
    if (data.Species !== undefined) {
        species = checkSpecies(data);
        species.forEach(function(element, index) {
            if (Array.isArray(data.Species)) {
                switch (element) {
                    case "NO2":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "NO2") {
                                response.data.push({
                                    "no2": element[
                                        '@AirQualityIndex'
                                        ]
                                });
                            }
                        });
                        break;
                    case "O3":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "O3") {
                                response.data.push({
                                    "o3": element[
                                        '@AirQualityIndex'
                                        ]
                                });
                            }
                        });
                        break;
                    case "SO2":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "SO2") {
                                response.data.push({
                                    "so2": element[
                                        '@AirQualityIndex'
                                        ]
                                });
                            }
                        });
                        break;
                    case "PM10":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "PM10") {
                                response.data.push({
                                    "pm10": element[
                                        '@AirQualityIndex'
                                        ]
                                });
                            }
                        });
                        break;
                    case "PM25":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "PM25") {
                                response.data.push({
                                    "pm25": element[
                                        '@AirQualityIndex'
                                        ]
                                });
                            }
                        });
                        break;
                    default:
                        break;
                }
            } else {
                switch (element) {
                    case "NO2":
                        if (data.Species['@SpeciesCode'] == "NO2") {
                            response.data.push({
                                "no2": data.Species[
                                    '@AirQualityIndex']
                            });
                        }
                        break;
                    case "O3":
                        if (data.Species['@SpeciesCode'] == "O3") {
                            response.data.push({
                                "o3": data.Species[
                                    '@AirQualityIndex']
                            });
                        }
                        break;
                    case "SO2":
                        if (data.Species['@SpeciesCode'] == "SO2") {
                            response.data.push({
                                "so2": data.Species[
                                    '@AirQualityIndex']
                            });
                        }
                        break;
                    case "PM10":
                        if (data.Species['@SpeciesCode'] == "PM10") {
                            response.data.push({
                                "pm10": data.Species[
                                    '@AirQualityIndex']
                            });
                        }
                        break;
                    case "PM25":
                        if (data.Species['@SpeciesCode'] == "PM25") {
                            response.data.push({
                                "pm25": data.Species[
                                    '@AirQualityIndex']
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return response;
    }
}

function returnDeviceData(data) {
    
    // PPM = RS / R0 where R0 = 75 (default for the intel smart citizen) 

    var convertedco = data.data.sensors[5].value / 75;
    var convertedno2 = data.data.sensors[4].value / 75;
    var data1 = {
        name: "NO2",
        value: convertedno2
    }
    var data2 = {
        name: "CO",
        value: convertedco
    }
    data1 = normaliseValue(data1);
    data2 = normaliseValue(data2);
    convertedno2 = data1.value;
    convertedco = data2.value;
    responseData = {
        "deviceID": data.id,
        "latitude": data.data.location.latitude, 
        "longitude": data.data.location.longitude,
        "datetime": data.last_reading_at,
        "data": [{
                "no2": convertedno2
            },
            {
                "co": convertedco
            }]
    };
    if (data.data.sensors[0].value != null) {
        responseData.data.push({
            "light": data.data.sensors[0].value
        });
    }
    if (data.data.sensors[7].value != null) {
        responseData.data.push({
            "noise": data.data.sensors[7].value
        });
    }
    return responseData;
}

function returnLocationData(data) {
    var responseData = {
        "location": data.location,
        "latitude": data.coordinates.latitude,
        "longitude": data.coordinates.longitude,
        "datetime": null,
        "data": []
    }
    var latestDate = "";
    data.measurements.forEach(function(element, index) {
        var toconvert = {
            "name": element.parameter,
            "value": element.value
        };
        toconvert = normaliseValue(toconvert);
        var response = {};
        response[toconvert.name] = toconvert.value;
        responseData.data.push(response);
        if (latestDate !== element.lastUpdated) {
            latestDate = element.lastUpdated;
        }
    });
    responseData.datetime = latestDate;
    return responseData;
}

function checkSpecies(data) {
    var responseData = [];
    if (data.Species.length > 1) {
        data.Species.forEach(function(element, index) {
            responseData.push(element['@SpeciesCode']);
        });
    } else {
        responseData.push(data.Species['@SpeciesCode']);
    }
    return responseData;
}

function normaliseValue(data) {
    switch (data.name) {
        case "O3":
        case "o3":
            if (0 <= data.value && data.value <= 33) {
                data.value = 1;
            } else if (34 <= data.value && data.value <= 66) {
                data.value = 2;
            } else if (67 <= data.value && data.value <= 100) {
                data.value = 3;
            } else if (101 <= data.value && data.value <= 120) {
                data.value = 4;
            } else if (121 <= data.value && data.value <= 140) {
                data.value = 5;
            } else if (141 <= data.value && data.value <= 160) {
                data.value = 6;
            } else if (161 <= data.value && data.value <= 187) {
                data.value = 7;
            } else if (188 <= data.value && data.value <= 213) {
                data.value = 8;
            } else if (214 <= data.value && data.value <= 240) {
                data.value = 9;
            } else if (241 <= data.value) {
                data.value = 10;
            }
            break;
        case "NO2":
        case "no2":
            if (0 <= data.value && data.value <= 67) {
                data.value = 1;
            } else if (68 <= data.value && data.value <= 134) {
                data.value = 2;
            } else if (135 <= data.value && data.value <= 200) {
                data.value = 3;
            } else if (201 <= data.value && data.value <= 267) {
                data.value = 4;
            } else if (268 <= data.value && data.value <= 334) {
                data.value = 5;
            } else if (335 <= data.value && data.value <= 400) {
                data.value = 6;
            } else if (401 <= data.value && data.value <= 467) {
                data.value = 7;
            } else if (468 <= data.value && data.value <= 534) {
                data.value = 8;
            } else if (535 <= data.value && data.value <= 600) {
                data.value = 9;
            } else if (601 <= data.value) {
                data.value = 10;
            }
            break;
        case "SO2":
        case "so2":
            if (0 <= data.value && data.value <= 88) {
                data.value = 1;
            } else if (89 <= data.value && data.value <= 177) {
                data.value = 2;
            } else if (178 <= data.value && data.value <= 266) {
                data.value = 3;
            } else if (267 <= data.value && data.value <= 354) {
                data.value = 4;
            } else if (355 <= data.value && data.value <= 443) {
                data.value = 5;
            } else if (444 <= data.value && data.value <= 532) {
                data.value = 6;
            } else if (533 <= data.value && data.value <= 710) {
                data.value = 7;
            } else if (711 <= data.value && data.value <= 887) {
                data.value = 8;
            } else if (888 <= data.value && data.value <= 1064) {
                data.value = 9;
            } else if (1065 <= data.value) {
                data.value = 10;
            }
            break;
        case "PM25":
        case "pm25":
            if (0 <= data.value && data.value <= 11) {
                data.value = 1;
            } else if (12 <= data.value && data.value <= 23) {
                data.value = 2;
            } else if (24 <= data.value && data.value <= 35) {
                data.value = 3;
            } else if (36 <= data.value && data.value <= 41) {
                data.value = 4;
            } else if (42 <= data.value && data.value <= 47) {
                data.value = 5;
            } else if (48 <= data.value && data.value <= 53) {
                data.value = 6;
            } else if (54 <= data.value && data.value <= 58) {
                data.value = 7;
            } else if (59 <= data.value && data.value <= 64) {
                data.value = 8;
            } else if (65 <= data.value && data.value <= 70) {
                data.value = 9;
            } else if (71 <= data.value) {
                data.value = 10;
            }
            break;
        case "PM10":
        case "pm10":
            if (0 <= data.value && data.value <= 16) {
                data.value = 1;
            } else if (17 <= data.value && data.value <= 33) {
                data.value = 2;
            } else if (34 <= data.value && data.value <= 50) {
                data.value = 3;
            } else if (51 <= data.value && data.value <= 58) {
                data.value = 4;
            } else if (59 <= data.value && data.value <= 66) {
                data.value = 5;
            } else if (67 <= data.value && data.value <= 75) {
                data.value = 6;
            } else if (76 <= data.value && data.value <= 83) {
                data.value = 7;
            } else if (84 <= data.value && data.value <= 91) {
                data.value = 8;
            } else if (92 <= data.value && data.value <= 100) {
                data.value = 9;
            } else if (101 <= data.value) {
                data.value = 10;
            }
            break;
        case "CO":
        case "co":
            if (0 <= data.value && data.value <= 16) {
                data.value = 1;
            } else if (17 <= data.value && data.value <= 33) {
                data.value = 2;
            } else if (34 <= data.value && data.value <= 50) {
                data.value = 3;
            } else if (51 <= data.value && data.value <= 58) {
                data.value = 4;
            } else if (59 <= data.value && data.value <= 66) {
                data.value = 5;
            } else if (67 <= data.value && data.value <= 75) {
                data.value = 6;
            } else if (76 <= data.value && data.value <= 83) {
                data.value = 7;
            } else if (84 <= data.value && data.value <= 91) {
                data.value = 8;
            } else if (92 <= data.value && data.value <= 100) {
                data.value = 9;
            } else if (101 <= data.value) {
                data.value = 10;
            }
            break;
        default:
            /* Cases not included in spec for the parameter values*/
            break;
    }
    return data;
}
