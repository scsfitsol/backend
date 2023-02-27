const Driver = require("../driver/model");
const service = require("./service");
const moment = require("moment");
const { createData } = require("./locationUpdate");
const Trip = require("../trip/model");

exports.locationUpdate = async () => {
  try {
    console.log("node cron job called");
    //fetch the current data of location using API
    const locationData = await service.get({
      where: {
        updateLocationTime: moment().toString(),
      },
    });
    console.log("locationData--->", locationData, Array.isArray(locationData));
    if (locationData?.length) {
      for (let i = 0; i < locationData?.length; i++) {
        //for one by one data updated
        await getLocationUpdateDetail(locationData[i]);
      }
    }
  } catch (error) {
    console.log("error in catch", error);
  }
};
const getLocationUpdateDetail = async (data) => {
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
};
