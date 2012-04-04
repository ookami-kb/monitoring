// вспомогательные функции для работы с координатами
function coordsToString(lat, lon) {
	return lat + ',' + lon;
}

function stringToCoords(str) {
	try {
		var coords = str.split(',');
		return {
			lat: coords[0],
			lon: coords[1]
		}
	}
	catch (exception) {
		console.log(exception);
		return null;
	}
}

function getDistance(coords) {
	try {
		return Math.sqrt((coords.lat-lat)*(coords.lat-lat) + (coords.lon-lon)*(coords.lon-lon));
	}
	catch (exception) {
		console.log(exception);
		return null;
	}
}

function calculateDistance(latA, longA, latB, longB) {
    var EARTH_RADIUS = 6372795;
 
    lat1 = latA * Math.PI / 180;
    lat2 = latB * Math.PI / 180;
    long1 = longA * Math.PI / 180;
    long2 = longB * Math.PI / 180;
 
    cl1 = Math.cos(lat1);
    cl2 = Math.cos(lat2);
    sl1 = Math.sin(lat1);
    sl2 = Math.sin(lat2);
    delta = long2 - long1;
    cdelta = Math.cos(delta);
    sdelta = Math.sin(delta);
 
    y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    x = sl1 * sl2 + cl1 * cl2 * cdelta;
 
    ad = Math.atan2(y, x);
    dist = Math.ceil(ad * EARTH_RADIUS);
 
    return dist;
}