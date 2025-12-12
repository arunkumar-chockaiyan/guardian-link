import { Coordinates } from '../types';

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let msg = "Unknown location error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "User denied location permission";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            msg = "The request to get user location timed out";
            break;
          default:
            msg = error.message;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
};