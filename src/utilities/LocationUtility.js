const getLocation = async() => {
    return new Promise((resolve, reject) => {
        var latitude = '';
        var longitude = '';

        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition((position) => {
                latitude = position.coords.latitude.toString();
                longitude = position.coords.longitude.toString();

                resolve([latitude, longitude]);
            },
            (error) => { 
                console.log('Error:', error.message); 
                resolve([latitude, longitude]);
            });
        } 
        else 
        {
            console.log('Geolocation is not supported by this browser.');
            resolve([latitude, longitude]);
        }
    })
}

function roundDown(lat){
    var first = lat.split('.')[0];
    var second = parseInt(lat.split('.')[1].substring(0, 5));

    var result1 = parseInt(second / 300);
    var result2 = result1 * 300;

    var output = first + '.' + result2.toString().padStart(5,'0');
    return output;
}

function addInterval(value)
{
    var first = value.split('.')[0];
    var second = parseInt(value.split('.')[1].substring(0, 5));

    var result1 = (parseInt(second) + 300);

    var output = first + '.' + result1.toString().padStart(5,'0');
    return output;
}

function minusInterval(value)
{
    var first = value.split('.')[0];
    var second = parseInt(value.split('.')[1].substring(0, 5));

    var result1 = (parseInt(second) - 300);

    var output = first + '.' + result1.toString().padStart(5,'0');
    return output;
}

function calculateDistance(lat1, lon1, lat2, lon2) 
{
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadius * c * 1000; // Distance in meters
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function findClosestStop(lat, lon, routeStopList)
{
    var closestStop = null;
    var closestDistance = 1000;

    for (var i=0 ; i<routeStopList.length ; i++)
    {
        var currDistance = calculateDistance(parseFloat(lat), parseFloat(lon), parseFloat(routeStopList[i]['lat']), parseFloat(routeStopList[i]['long']));
        if (currDistance < closestDistance)
        {
            closestDistance = currDistance;
            closestStop = routeStopList[i];
        }
    }

    return closestStop;
}

export { getLocation, roundDown, addInterval, minusInterval, calculateDistance, findClosestStop }