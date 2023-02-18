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
var config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://india-agw.telenity.com/oauth/token?grant_type=client_credentials",
  headers: {
    Authorization: "Basic c21hcnR0cmFpbGNsb3VkOnNtYXJ0dHJhaWxjbG91ZA==",
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
    Host: "india-agw.telenity.com",
  },
};
exports.consentAuthApi = () => axios(config);

// axios.post(
//   `https://india-agw.telenity.com/oauth/token?grant_type=client_credentials`,
//   {
//     headers: {
//       Authorization: "Basic c21hcnR0cmFpbGNsb3VkOnNtYXJ0dHJhaWxjbG91ZA==",
//       Accept: "*/*",
//       "Content-Type": "application/x-www-form-urlencoded",
//       Host: "india-agw.telenity.com",
//     },
//   }
// );
exports.consentApi = (driverNumber, token) =>
  axios.get(
    `https://india-agw.telenity.com/apigw/NOFBconsent/v1/NOFBconsent?address=tel:+91${driverNumber}`,
    {
      headers: {
        Host: "india-agw.telenity.com",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "curl/7.50.3",
      },
    }
  );
