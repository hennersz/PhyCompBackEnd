var express = require('express');
var request = require('request');
var path = require('path');


exports.haversine = function haversine(lat1, lat2, lon1, lon2) {

	var R = 6371000;
	var deltaLat = toRadians(lat2 - lat1);
	var deltaLon = toRadians(lon2 - lon1);

	var a = Math.sin(deltaLat / 2) * Math.sin( deltaLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) * Math.sin( deltaLon / 2);

	var c = 2 * Math.atan(Math.sqrt(a), Math.sqrt( 1 - a));

	var d = R * c;

}

function toRadians(value) {

	return ((value / 180) * Math.PI);

}

exports.locate = function locateNearest(lat, lon) {
	

}