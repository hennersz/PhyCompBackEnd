var testData = [
  {
    "_id":"5702b14be4b4872d5d92b50b",
    "datetime":"2015-03-25T20:00:38Z",
    "data":{
      "no2":{
        "value":1,
        "units":"AirQualityIndex",
        "raw_value":0.01264,
        "raw_units":"ppm"
      },
      "co":{
        "value":1,
        "units":"AirQualityIndex",
        "raw_value":1.97912,
        "raw_units":"ppm"
      },
      "light":{
        "value":55.4,
        "units":"Lux",
        "raw_value":55.4,
        "raw_units":"Lux"
      },
      "noise":{
        "value":50,
        "units":"dB",
        "raw_value":50,
        "raw_units":"dB"
      },
      "so2":null,
      "o3":null,
      "pm10":null,
      "pm25":null,
    },
    "loc":{
      "type":"Point",
      "coordinates":[-0.127758299999982,51.5073509]
    }
  },
	{
		"_id":"571770821828c4a8533c008e",
		"datetime":"2016-04-20 14:00:00",
		"data":{
			"no2":{
				"value":"2",
				"units":"AirQualityIndex",
				"raw_value":"2",
				"raw_units":"AirQualityIndex"
			},
			"o3":{
				"value":"1",
				"units":"AirQualityIndex",
				"raw_value":"1",
				"raw_units":"AirQualityIndex"
			},
			"pm10":{
				"value":"3",
				"units":"AirQualityIndex",
				"raw_value":"3",
				"raw_units":"AirQualityIndex"
			},
			"so2":null,
			"pm25":{
				"value":"6",
				"units":"AirQualityIndex",
				"raw_value":"6",
				"raw_units":"AirQualityIndex"
      },
			"co":null,
			"light":null,
			"noise":null
		},
		"loc":{
			"type":"Point",
			"coordinates":[
				-0.158089,
				51.552476
			]
		}
  },
	{
		"_id":"571770821828c4a8533c0098",
		"datetime":"2016-04-20 14:00:00",
		"data":{
			"no2":{
				"value":"3",
				"units":"AirQualityIndex",
				"raw_value":"3",
				"raw_units":"AirQualityIndex"
			},
			"o3":{
				"value":"5",
				"units":"AirQualityIndex",
				"raw_value":"5",
				"raw_units":"AirQualityIndex"
			},
			"pm10":{
				"value":"3",
				"units":"AirQualityIndex",
				"raw_value":"3",
				"raw_units":"AirQualityIndex"
			},
			"so2":{
        "value": "10",
        "units": "AirQualityIndex",
        "raw_value": "10",
        "raw_units": "AirQualityIndex"
      },
			"pm25":null,
			"co":null,
			"light":null,
			"noise":null
		},
		"loc":{
			"type":"Point",
			"coordinates":[
				-0.25089239,
				51.88234
			]
		}
  }

];

module.exports = testData;
