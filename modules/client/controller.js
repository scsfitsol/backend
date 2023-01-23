const service = require("./service");
const Organization = require("../organization/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const userModel = require("../user/model");
exports.create = async (req, res, next) => {
  try {
    req.body.organizationId = req.requestor.organizationId;
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
        organizationId: req.requestor.organizationId,
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
    const data = await service.get({
      organizationId: req.requestor.organizationId,
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

    const data = await service.update(req.body, {
      where: {
        id,
        organizationId: req.requestor.organizationId,
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
        organizationId: req.requestor.organizationId,
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
      if (correctPassword) {
        const token = jwt.sign(
          {
            id: admin.id,
            role: admin.role,
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
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Admin login fail bcz id and password doesn't match",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [user] = await userService.get({ where: { email } });

    if (!user)
      return next(
        new createError(404, `No user found with the email ${req.body.email}`)
      );

    user.passResetToken = uuidv4();

    console.log(1, user.passResetToken);

    // Set passResetTokenExpiresIn
    user.passResetTokenExpiresIn = Date.now() + 2 * 60 * 1000; //min to ms

    await user.save({ hooks: false });
    // Send an email with the token(plain) to client
    const resetURL = `${req.protocol}s://${req.get(
      "host"
    )}/api/v1/users/reset/password/${user.passResetToken}`;
    console.log(resetURL);

    const isEmailSent = await sendEmail({
      recipientEmails: [user.email],
      subject: "Your password reset token (valid for 2 min)",
      html: `
<!DOCTYPE html>
<html>    
<head>    
    <title>Universiti</title>    
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

    console.log("Is email sent ", isEmailSent);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      resetURL,
    });
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    console.log("test");
    console.log(req.body);

    const passResetToken = req.params.token;

    console.log(passResetToken);

    // Find the user by the encrypted token
    const [user] = await userService.get({
      where: { passResetToken },
    });

    // Check if the user is found and token is not expired
    if (!user || Date.now() > user.passResetTokenExpiresIn)
      return next(
        new createError(
          400,
          "Token is invalid or expired! Do forgot password again"
        )
      );

    // If all ok, reset password & distroy the token
    user.password = req.body.newPassword;
    user.passResetToken = undefined;
    user.passResetTokenExpiresIn = undefined;

    await user.save();

    // res.status(200).json({
    //   status: "success",
    //   message:
    //     "Password changed successfully. Now you can login with the new password",
    // });
    res.redirect("https://market.universiti.com/");
  } catch (err) {
    next(err);
  }
};