let locationWatcherId = null;

export function startLocationWatcher(callback) {
  const options = { enableHighAccuracy: false, timeout: 10000, maximumAge: 0, distanceFilter: 10 };

  locationWatcherId = navigator.geolocation.watchPosition(
    (currPosition) => {
      const { latitude, longitude } = currPosition.coords;
      callback([latitude, longitude]);
    },
    (error) => {
      callback([]);
      // Handle location error
    },
    options
  );
}

export function stopLocationWatcher() {
  if (locationWatcherId) {
    navigator.geolocation.clearWatch(locationWatcherId);
    locationWatcherId = null;
  }
}