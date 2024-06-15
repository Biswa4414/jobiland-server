//This sendToken function is used to send a JWT token to the client along with an HTTP response.
const sendToken = (user, statusCode, res, message) => {
  //calls the getJWTToken() method on the user object to generate a JWT token for the user
  const token = user.getJWTToken();
  const expires = new Date(
    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );
  const options = {
    expires: expires,
    //httpOnly: Sets the httpOnly option to true, which means that the cookie cannot be accessed by client-side JavaScript. This enhances security by mitigating certain types of XSS (cross-site scripting) attacks.
    httpOnly: true,
  };

  return (
    res
      // Sets the cookie named "Token" with the JWT token and the specified options.
      .cookie("Token", token, options)
      .status(statusCode)
      .send({
        success: true,
        user,
        message,
        token,
      })
  );
};

module.exports = sendToken;
