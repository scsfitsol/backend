const { default: axios, AxiosError, AxiosResponse } = require("axios");
const token = require("../utils/constant");

exports.authApi = () =>
  axios.get(`${process.env.API_TELENITY_BASE_URL}/login`, {
    headers: {
      Authorization: `Basic Zml0c29sOkZpdHNvbEAxMjM0NQ==`,
    },
  });
exports.locationApi = async (driverNumber) => {
  if (token.token == "") {
    const auth = await this.authApi();
    token.token = auth?.data?.token;
  }

  return axios
    .get(
      `${process.env.API_TELENITY_BASE_URL}/location/msisdnList/${driverNumber}?lastResult=True`,
      {
        headers: {
          Host: "smarttrail.telenity.com",
          token: token.token,
          "Content-Type": "application/json",
        },
      }
    )
    .catch(async (reason) => {
      if (reason?.response?.status === 401) {
        token.token = "";
        await this.locationApi(driverNumber);
      } else {
        // Handle else
      }
      console.log(reason?.message);
    });
};

exports.importApi = (firstName, lastName, msisdn, token) =>
  axios.post(
    `${process.env.API_TELENITY_BASE_URL}/entities/import`,
    {
      entityImportList: [
        { firstName: firstName, lastName: lastName, msisdn: msisdn },
      ],
    },
    {
      headers: {
        Host: "smarttrail.telenity.com",
        token: token,
        "Content-Type": "application/json",
        "User-Agent": "curl/7.29.0",
      },
    }
  );
exports.entitySearchApi = (driverNumber, token) =>
  axios.get(
    `${process.env.API_TELENITY_BASE_URL}/entities?search=${driverNumber}`,
    {
      headers: {
        Host: "smarttrail.telenity.com",
        token: token,
        "Content-Type": "application/json",
      },
    }
  );
exports.deleteApi = (id, token) =>
  axios.delete(
    `${process.env.API_TELENITY_BASE_URL}/entities/${id}?permanent=true`,
    {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    }
  );
