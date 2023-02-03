const service = require("./service");
const Organization = require("../organization/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../../utils/email");
const { sqquery } = require("../../utils/query");
var createError = require("http-errors");

exports.create = async (req, res, next) => {
  try {
    const [clientWithSameEmail] = await service.get({
      where: {
        email: req.body.email,
        organizationId: req?.requestor?.organizationId,
      },
    });

    // user with email is  found.
    if (clientWithSameEmail) {
      return next(
        createError(400, "This email is already register,try with another one")
      );
    }
    if (req.file) {
      req.body.profilePic = req.file.location;
    }
    req.body.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    const data = await service.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Add Client successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.params.id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
      include: [
        {
          model: Organization,
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    req.query.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;

    const data = await service.get({
      ...sqquery(req.query),
      include: [
        {
          model: Organization,
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.file) {
      req.body.profilePic = req.file.location;
    }
    const data = await service.update(req.body, {
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit Client successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await service.remove({
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(200).send({
      status: "success",
      message: "delete client successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [admin] = await service.get({
      where: {
        email,
      },
    });
    if (admin) {
      const correctPassword = await bcrypt.compare(password, admin.password);
      if (correctPassword == true) {
        const token = jwt.sign(
          {
            id: admin.id,
            role: "client",
            organizationId: admin.organizationId,
          },
          process.env.JWT_SECRETE,
          {
            expiresIn: process.env.JWT_EXPIREIN,
          }
        );
        res.status(200).json({
          status: "success",
          message: "client login successfully",
          token,
        });
      } else {
        next(
          createError(
            401,
            "Client login fail bcz id and password doesn't match"
          )
        );
      }
    } else {
      next(
        createError(401, "Client login fail bcz id and password doesn't match")
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [client] = await service.get({ where: { email } });
    if (!client)
      return res.status(400).json({
        status: "fail",
        message: "user not found",
      });
    client.passResetToken = uuidv4();

    // Set passResetTokenExpiresIn
    client.passResetTokenExpiresIn = Date.now() + 2 * 60 * 1000; //min to ms

    await client.save({ hooks: false });
    // Send an email with the token(plain) to client
    const resetURL = `http://${req.get("host")}/api/v1/client/resetPassword/${
      client.passResetToken
    }`;
    const isEmailSent = await sendEmail({
      recipientEmails: [client.email],
      subject: "Your password reset token (valid for 2 min)",
      html: `<!DOCTYPE html>
<html>    
<head>    
    <title>SERVED</title>    
    <style>
    body  
{  
    margin: 0;  
    padding: 0;  
    background-color:#6abadeba;  
    font-family: 'Arial';  
}  
.login{  
        width: 382px;  
        overflow: hidden;  
        margin: auto;  
        margin: 20 0 0 450px;  
        padding: 80px;  
        background: #23463f;  
        border-radius: 15px ;  
          
}  
h2{  
    text-align: center;  
    color: #277582;  
    padding: 20px;  
}  
label{  
    color: #08ffd1;  
    font-size: 17px;  
}  
#Uname{  
    width: 300px;  
    height: 30px;  
    border: none;  
    border-radius: 3px;  
    padding-left: 8px;  
}  
#Pass{  
    width: 300px;  
    height: 30px;  
    border: none;  
    border-radius: 3px;  
    padding-left: 8px;  
      
}  
#log{  
    width: 300px;  
    height: 30px;  
    border: none;  
    border-radius: 17px;  
    padding-left: 7px;  
    color: blue;  
  
  
}  
span{  
    color: white;  
    font-size: 17px;  
}  
a{  
    float: right;  
    background-color: grey;  
}  
</style>
</head>    
<body>    
    <h2>Password Reset</h2><br>    
    <div class="login">    
    <form id="login" action=${resetURL} method="post">    
        <label><b>New Password     
        </b>    
        </label>    
        <input type="Password" name="newPassword" id="Pass" placeholder="Enter New Password">    
        <br><br>    
         <input type="submit" id="log" value="Reset Password" />
        <br><br>    
    </form>     
</div>    
</body>    
</html> `,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      resetURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const passResetToken = req.params.token;

    // Find the user by the encrypted token
    const [client] = await service.get({
      where: { passResetToken },
    });

    // Check if the user is found and token is not expired
    if (!client || Date.now() > client.passResetTokenExpiresIn)
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or expired! Do forgot password again",
      });

    // If all ok, reset password & distroy the token
    const salt = bcrypt.genSaltSync();
    newPassword = bcrypt.hashSync(req.body.newPassword, salt);
    client.password = newPassword;
    client.passResetToken = undefined;
    client.passResetTokenExpiresIn = undefined;

    await client.save();

    res.status(200).json({
      status: "success",
      message:
        "Password changed successfully. Now you can login with the new password",
    });
    // res.redirect("https://client.servdapp.com/login");
  } catch (error) {
    next(error);
  }
};
exports.getMe = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.requestor.id,
      },
      include: [
        {
          model: Organization,
        },
      ],
    });

    res.status(200).send({
      status: 200,
      message: "getMe successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
