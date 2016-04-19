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

    var final = [];

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

    final = collated1.concat(collated2);

    return final;
}

function returnSiteData(data) {

    var response = {
        "latitude": data['@Latitude'], 
        "longitude": data['@Longitude'], 
        "datetime": data['@BulletinDate'],
        "data": {}
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
                                response.data['no2'] = {
                                        "value" : element['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                            }
                        });
                        break;
                    case "O3":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "O3") {
                                response.data['o3'] = {
                                        "value" : element['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                            }
                        });
                        break;
                    case "SO2":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "SO2") {
                                response.data['so2'] = {
                                        "value" : element['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                            }
                        });
                        break;
                    case "PM10":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "PM10") {
                                response.data['pm10'] = {
                                        "value" : element['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                            }
                        });
                        break;
                    case "PM25":
                        data.Species.forEach(function(element,
                            index) {
                            if (element['@SpeciesCode'] ==
                                "PM25") {
                                response.data['pm25'] = {
                                        "value" : element['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
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
                            response.data['no2'] = {
                                        "value" : data.Species['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                        }
                        break;
                    case "O3":
                        if (data.Species['@SpeciesCode'] == "O3") {
                            response.data['o3'] = {
                                        "value" : data.Species['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                        }
                        break;
                    case "SO2":
                        if (data.Species['@SpeciesCode'] == "SO2") {
                            response.data['so2'] = {
                                        "value" : data.Species['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                        }
                        break;
                    case "PM10":
                        if (data.Species['@SpeciesCode'] == "PM10") {
                            response.data['pm10'] = {
                                        "value" : data.Species['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                        }
                        break;
                    case "PM25":
                        if (data.Species['@SpeciesCode'] == "PM25") {
                            response.data['pm25'] = {
                                        "value" : data.Species['@AirQualityIndex'],
                                        "units" : "AirQualityIndex",
                                        "raw_value" : element['@AirQualityIndex'],
                                        "raw_units" : "AirQualityIndex"
                                    };
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return completeParameters(response);
    }
}

function returnDeviceData(data) {

    responseData = {
        "latitude": data.data.location.latitude, 
        "longitude": data.data.location.longitude,
        "datetime": data.last_reading_at,
        "data": {}
    };

    // PPM = RS / R0 where R0 = 75 (default for the intel smart citizen) 

    var rawno2 = data.data.sensors[4].value / 75;
    var rawco = data.data.sensors[5].value / 75;

    var data1 = {
        name: "NO2",
        value: rawno2
    }

    var data2 = {
        name: "CO",
        value: rawco
    }
    
    data1 = normaliseValue(data1);
    data2 = normaliseValue(data2);
    


    var no2input = {
        "value" : data1.value,
        "units" : "AirQualityIndex",
        "raw_value" : rawno2,
        "raw_units" : "ppm"
    };

    var coinput = {
        "value" : data2.value,
        "units" : "AirQualityIndex",
        "raw_value" : rawco,
        "raw_units" : "ppm"
    };
    responseData.data['no2'] = no2input;
    responseData.data['co'] = coinput;

    if (data.data.sensors[0].value != null) {
        responseData.data['light'] =  {
                "value" : data.data.sensors[0].value,
                "units" : data.data.sensors[0].unit,
                "raw_value" : data.data.sensors[0].value,
                "raw_units" : data.data.sensors[0].unit
            };
    }
    if (data.data.sensors[7].value != null) {
        responseData.data['noise'] = {
                "value" : data.data.sensors[7].value,
                "units" : data.data.sensors[7].unit,
                "raw_value" : data.data.sensors[7].value,
                "raw_units" : data.data.sensors[7].unit
            };
    }
    return completeParameters(responseData);
}

function returnLocationData(data) {

    var responseData = {
        "latitude": data.coordinates.latitude,
        "longitude": data.coordinates.longitude,
        "datetime": null,
        "data": {}
    };

    var latestDate = "";

    data.measurements.forEach(function(element, index) {

        var toconvert = {
            "name": element.parameter,
            "value": element.value
        };

        toconvert = normaliseValue(toconvert);

        var response = {};

        responseData.data[toconvert.name] = {
            "value" : toconvert.value,
            "units" : "AirQualityIndex",
            "raw_value" : element.value,
            "raw_units" : element.unit 
        };

        if (latestDate !== element.lastUpdated) {
            latestDate = element.lastUpdated;
        }

    });

    responseData.datetime = latestDate;
    return completeParameters(responseData);
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
            if (data.value <= 33) {
                data.value = 1;
            } else if (data.value <= 66) {
                data.value = 2;
            } else if (data.value <= 100) {
                data.value = 3;
            } else if (data.value <= 120) {
                data.value = 4;
            } else if (data.value <= 140) {
                data.value = 5;
            } else if (data.value <= 160) {
                data.value = 6;
            } else if (data.value <= 187) {
                data.value = 7;
            } else if (data.value <= 213) {
                data.value = 8;
            } else if (data.value <= 240) {
                data.value = 9;
            } else if (240 <= data.value) {
                data.value = 10;
            }
            break;
        case "NO2":
        case "no2":
            if (data.value <= 67) {
                data.value = 1;
            } else if (data.value <= 134) {
                data.value = 2;
            } else if (data.value <= 200) {
                data.value = 3;
            } else if (data.value <= 267) {
                data.value = 4;
            } else if (data.value <= 334) {
                data.value = 5;
            } else if (data.value <= 400) {
                data.value = 6;
            } else if (data.value <= 467) {
                data.value = 7;
            } else if (data.value <= 534) {
                data.value = 8;
            } else if (data.value <= 600) {
                data.value = 9;
            } else if (600 <= data.value) {
                data.value = 10;
            }
            break;
        case "SO2":
        case "so2":
            if (data.value <= 88) {
                data.value = 1;
            } else if (data.value <= 177) {
                data.value = 2;
            } else if (data.value <= 266) {
                data.value = 3;
            } else if (data.value <= 354) {
                data.value = 4;
            } else if (data.value <= 443) {
                data.value = 5;
            } else if (data.value <= 532) {
                data.value = 6;
            } else if (data.value <= 710) {
                data.value = 7;
            } else if (data.value <= 887) {
                data.value = 8;
            } else if (data.value <= 1064) {
                data.value = 9;
            } else if (1064 <= data.value) {
                data.value = 10;
            }
            break;
        case "PM25":
        case "pm25":
            if (data.value <= 11) {
                data.value = 1;
            } else if (data.value <= 23) {
                data.value = 2;
            } else if (data.value <= 35) {
                data.value = 3;
            } else if (data.value <= 41) {
                data.value = 4;
            } else if (data.value <= 47) {
                data.value = 5;
            } else if (data.value <= 53) {
                data.value = 6;
            } else if (data.value <= 58) {
                data.value = 7;
            } else if (data.value <= 64) {
                data.value = 8;
            } else if (data.value <= 70) {
                data.value = 9;
            } else if (70 <= data.value) {
                data.value = 10;
            }
            break;
        case "PM10":
        case "pm10":
            if (data.value <= 16) {
                data.value = 1;
            } else if (data.value <= 33) {
                data.value = 2;
            } else if (data.value <= 50) {
                data.value = 3;
            } else if (data.value <= 58) {
                data.value = 4;
            } else if (data.value <= 66) {
                data.value = 5;
            } else if (data.value <= 75) {
                data.value = 6;
            } else if (data.value <= 83) {
                data.value = 7;
            } else if (data.value <= 91) {
                data.value = 8;
            } else if (data.value <= 100) {
                data.value = 9;
            } else if (100 <= data.value) {
                data.value = 10;
            }
            break;
        case "CO":
        case "co":
            if (data.value <= 16) {
                data.value = 1;
            } else if (data.value <= 33) {
                data.value = 2;
            } else if (data.value <= 50) {
                data.value = 3;
            } else if (data.value <= 58) {
                data.value = 4;
            } else if (data.value <= 66) {
                data.value = 5;
            } else if (data.value <= 75) {
                data.value = 6;
            } else if (data.value <= 83) {
                data.value = 7;
            } else if (data.value <= 91) {
                data.value = 8;
            } else if (data.value <= 100) {
                data.value = 9;
            } else if (100 <= data.value) {
                data.value = 10;
            }
            break;
        default:
            /* Cases not included in spec for the parameter values*/
            break;
    }
    return data;
}

// Autocompletes all empty parameters in a record of data

function completeParameters(record) {

    var data = record.data;

    if ( !("no2" in record.data) ) {
        record.data['no2'] = null;
    }
    if ( !("so2" in record.data) ) {
        record.data['so2'] = null;
    }
    if ( !("o3" in record.data) ) {
        record.data['o3'] = null;
    }
    if ( !("pm10" in record.data) ) {
        record.data['pm10'] = null;
    }
    if ( !("pm25" in record.data) ) {
        record.data['pm25'] = null;
    }
    if ( !("co" in record.data) ) {
        record.data['co'] = null;
    }
    if ( !("light" in record.data) ) {
        record.data['light'] = null;
    }
    if ( !("noise" in record.data) ) {
        record.data['noise'] = null;
    } 

    return record;
}

