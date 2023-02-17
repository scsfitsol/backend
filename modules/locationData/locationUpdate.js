const service = require("./service");
const { v4: uuidv4 } = require("uuid");
const { sqquery } = require("../../utils/query");
var createError = require("http-errors");
const moment = require("moment");
const {
  authApi,
  locationApi,
  entitySearchApi,
  deleteApi,
} = require("../../utils/api_calls");

exports.createData = async (tripId, driverNumber) => {
  try {
    const updateLocationTime = moment()
      .add(15, "minutes")
      .set({ second: 0, millisecond: 0 });
    //const auth = await authApi();
    //const token = auth?.data?.token;
    let location = -1;
    try {
      location = await locationApi(driverNumber);
    } catch (error) {
      console.log("error------->", error);
    }

    const locationData = location?.data?.terminalLocation;
    console.log("locationData---->", location?.data);
    console.log("locationData---->", locationData);
    if (locationData.length) {
      const data = await service.create({
        latitude: locationData[0]?.currentLocation?.latitude,
        longtitude: locationData[0]?.currentLocation?.longitude,
        timestamp: locationData[0]?.currentLocation?.timestamp,
        detailedAddress: locationData[0]?.currentLocation?.timestamp,
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
