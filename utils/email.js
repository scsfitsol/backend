const AWS = require("aws-sdk");
const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

exports.sendEmail = async function ({
  recipientEmails,
  ReplyToAddresses,
  subject,
  html,
}) {
  let params = {
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: recipientEmails,
    },
    ReplyToAddresses: ReplyToAddresses || [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  console.log("process.env.AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID);
  console.log(
    "process.env.AWS_SECRET_ACCESS_KEY",
    process.env.AWS_SECRET_ACCESS_KEY
  );
  console.log("process.env.AWS_REGION", process.env.AWS_REGION);

  return AWS_SES.sendEmail(params).promise();
};
