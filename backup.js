// ===== NEARBY STOPS =====

const onClickSearch = async() => {
    // var newEtaList = {107:{'route':'107', 'eta':'5'}, 108:{'route':'108', 'eta':'5'}};
    // setEtaList(newEtaList);
    // setSuggestList({});

    var location = await getLocation();
    var roundLat = roundDown(location[0]);
    var roundLong = roundDown(location[1]);

    var topLeft = (minusInterval(roundLat)) + ',' + (minusInterval(roundLong));
    var top = (minusInterval(roundLat)) + ',' + (roundLong);
    var topRight = (minusInterval(roundLat)) + ',' + (addInterval(roundLong));

    var left = roundLat + ',' + (minusInterval(roundLong));
    var center = roundLat + ',' + roundLong;
    var right = roundLat + ',' + (addInterval(roundLong));

    var bottomLeft = (addInterval(roundLat)) + ',' + (minusInterval(roundLong));
    var bottom = (addInterval(roundLat)) + ',' + (roundLong);
    var bottomRight = (addInterval(roundLat)) + ',' + (addInterval(roundLong));

    console.log(topLeft);
    console.log(top);
    console.log(topRight);

    console.log(left);
    console.log(center);
    console.log(right);

    console.log(bottomLeft);
    console.log(bottom);
    console.log(bottomRight);

    var locationRouteStop = {};
    if (topLeft in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[topLeft]}; }
    if (top in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[top]}; }
    if (topRight in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[topRight]}; }

    if (left in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[left]}; }
    if (center in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[center]}; }
    if (right in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[right]}; }

    if (bottomLeft in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[bottomLeft]}; }
    if (bottom in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[bottom]}; }
    if (bottomRight in locationBasedList) { locationRouteStop = {...locationRouteStop, ...locationBasedList[bottomRight]}; }

    // console.log('route stop');
    // console.log(locationRouteStop);
    var newLocationRouteStop = {};
    var routeDistance = {};
    for (const key in locationRouteStop)
    {
        var currRouteID = locationRouteStop[key]['route_id'];
        var currLat = locationRouteStop[key]['lat'];
        var currLong = locationRouteStop[key]['long'];
        var currDistance = calculateDistance(parseFloat(location[0]), parseFloat(location[1]), parseFloat(currLat), parseFloat(currLong));

        if (currRouteID in routeDistance == false)
        {
            routeDistance[currRouteID] = currDistance;
            newLocationRouteStop[currRouteID] = locationRouteStop[key];
        }
        else
        {
            if (currDistance < routeDistance[currRouteID])
            {
                routeDistance[currRouteID] = currDistance;
                newLocationRouteStop[currRouteID] = locationRouteStop[key];
            }
        }
    }

    console.log(newLocationRouteStop);        
}
