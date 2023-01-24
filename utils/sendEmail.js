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
  return AWS_SES.sendEmail(params).promise();
};
