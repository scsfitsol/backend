const service = require("./service");
const { v4: uuidv4 } = require("uuid");
const { sqquery } = require("../../utils/query");
var createError = require("http-errors");
const moment = require("moment");
const Vehicle = require("../vehicle/model");
const { promisify } = require("util");
const request = require("request");
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
  console.log("trip------>", tripId, driverNumber, type, vehicleId, moment());
  try {
    const updateLocationTime = moment()
      .add(15, "minutes")
      .set({ second: 0, millisecond: 0 });
    //const auth = await authApi();
    //const token = auth?.data?.token;
    if (type == "simBased") {
      let location = -1;
      try {
        console.log("time1------->", moment());
        location = await locationApi(driverNumber);
      } catch (error) {
        console.log("error------->", error);
      }

      const locationData = location?.data?.terminalLocation;
      console.log("locationData---->", location?.data);
      console.log("locationData---->", locationData);
      console.log(
        "latitude------>",
        locationData[0]?.currentLocation?.latitude
      );
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
        console.log("data added successfully");
      } else {
        console.log("error------>", location?.data?.errorMessageList);
        // resolve();
      }
      await delay(4000);
    } else {
      try {
        console.log("inelse-->");
        const vehicleData = await Vehicle.findOne({
          where: {
            id: vehicleId,
          },
        });
        const vehicleNumber = vehicleData?.registrationNumber;
        console.log("inelse-->", vehicleNumber);
        try {
          const address = await promisify(request)(
            getLocationByGoogleApi(12.6655, 77.7545)
          );
          console.log("address------->", address);
        } catch (error) {
          console.log("error----->", error);
        }

        const locationData = await getDataApi();
        console.log("inelse-->", locationData.data);
        const locationFilter = locationData.data.filter(
          (location) => location.vehicleregnumber == vehicleNumber
        );
        console.log("locationFilter----->", locationFilter);

        const data = await service.create({
          latitude: locationFilter[0]?.latitude,
          longtitude: locationFilter[0]?.longitude,
          timestamp: locationFilter[0]?.datetime,
          detailedAddress: null,
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
    console.log("id1---->", searchApi?.data?.data[0]?.id);
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
