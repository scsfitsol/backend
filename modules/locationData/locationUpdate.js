const service = require("./service");
const { v4: uuidv4 } = require("uuid");
const { sqquery } = require("../../utils/query");
var createError = require("http-errors");
const moment = require("moment");
const Vehicle = require("../vehicle/model");

const {
  authApi,
  locationApi,
  entitySearchApi,
  deleteApi,
  getDataApi,
  getLocationByGoogleApi,
} = require("../../utils/api_calls");

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

exports.createData = async (tripId, driverNumber, type, vehicleId) => {
  try {
    const updateLocationTime = moment()
      .add(15, "minutes")
      .set({ second: 0, millisecond: 0 });

    if (type == "simBased") {
      let location = -1;
      try {
        location = await locationApi(driverNumber);
      } catch (error) {
        console.log("error------->", error);
      }

      const locationData = location?.data?.terminalLocation;

      if (locationData.length) {
        const data = await service.create({
          latitude: locationData[0]?.currentLocation?.latitude,
          longtitude: locationData[0]?.currentLocation?.longitude,
          timestamp: locationData[0]?.currentLocation?.timestamp,
          detailedAddress: locationData[0]?.currentLocation?.detailedAddress,
          updateLocationTime: updateLocationTime.toString(),
          tripId: tripId,
          locationResultStatusText: locationData[0]?.locationResultStatusText
            ? locationData[0]?.locationResultStatusText
            : "Internal Server Error",
        });
      } else {
        console.log("error------>", location?.data?.errorMessageList);
        // resolve();
      }
      await delay(4000);
    } else {
      try {
        const vehicleData = await Vehicle.findOne({
          where: {
            id: vehicleId,
          },
        });
        const vehicleNumber = vehicleData?.registrationNumber;

        const locationData = await getDataApi();

        const locationFilter = locationData.data.filter(
          (location) => location.vehicleregnumber == vehicleNumber
        );
        let address;
        try {
          address = await getLocationByGoogleApi(
            locationFilter[0]?.latitude,
            locationFilter[0]?.longitude
          );
        } catch (error) {
          console.log("error in google location api");
        }

        const data = await service.create({
          latitude: locationFilter[0]?.latitude,
          longtitude: locationFilter[0]?.longitude,
          timestamp: locationFilter[0]?.datetime,
          detailedAddress: address?.plus_code?.compound_code,
          updateLocationTime: updateLocationTime.toString(),
          tripId: tripId,
          locationResultStatusText: locationFilter[0]?.latitude
            ? "success"
            : "Internal Server Error",
        });
      } catch (error) {
        console.log("error------->", error);
      }
    }
  } catch (error) {
    console.log("error--->", error);
  }
};
exports.deleteNumber = async (driverNumber) => {
  try {
    const auth = await authApi();
    const token = auth?.data?.token;
    const searchApi = await entitySearchApi(driverNumber, token);
    const id = searchApi?.data?.data[0]?.id;
    const deleteData = await deleteApi(id, token);
    console.log("deleteData------->", deleteData?.data);
  } catch (error) {
    console.log("error------>", error);
  }
};
exports.add = async (driverNumber) => {
  try {
    const auth = authApi();
    const token = auth?.data?.token;
  } catch (error) {
    console.log("error---->", error);
  }
};
