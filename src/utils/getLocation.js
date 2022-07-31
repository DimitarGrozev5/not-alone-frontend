export const getLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        // code 1
        if (err.code === 1) {
          reject({
            message:
              "Не е разрешено записването на GPS данни на това устройство",
          });
        }
        reject(err);
      },
      { enableHighAccuracy: true }
    );
  });
