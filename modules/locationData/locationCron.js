const Driver = require("../driver/model");
const service = require("./service");
const moment = require("moment");
const { createData } = require("./locationUpdate");
const Trip = require("../trip/model");

exports.locationUpdate = async () => {
  try {
    console.log("node cron job called");
    let tripData, driverNumber;

    //fetch the current data of location using API
    const locationData = await service.get({
      where: {
        updateLocationTime: moment().toString(),
      },
    });
    console.log("locationData--->", locationData, Array.isArray(locationData));
    if (locationData?.length) {
      const locationAllFunctions = locationData.map((data) =>
        getLocationUpdateDetail(data)
      );
      console.log(
        "locationAllFunctions",
        locationAllFunctions,
        locationAllFunctions.length
      );
      await Promise.all(locationAllFunctions);
    }
  } catch (error) {
    console.log("error in catch", error);
  }
};
const getLocationUpdateDetail = async (data) => {
  console.log("data----->", data.tripId);
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      console.log("moment----->", moment());
      let tripData;
      try {
        tripData = await Trip.findOne({
          where: {
            id: data.tripId,
            status: 2,
          },
        });
        if (tripData) {
          const driverData = await Driver.findOne({
            where: {
              id: tripData.driverId,
            },
          });
          driverNumber = `91${driverData?.mobile}`;
        }
        console.log("tripId--->", tripData?.id);
        console.log("driverNumber--->", driverNumber);

        await createData(
          tripData?.id,
          driverNumber,
          tripData?.type,
          tripData?.vehicleId
        );
      } catch (error) {
        console.log("Error in getLocationUpdatedetail", error);
        reject(error);
      }
    }, 4000);
  });
};
