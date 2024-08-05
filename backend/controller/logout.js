async function logout(request, response) {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        // expires: new Date(0), // Immediately expire the cookie
      };
  
      // Clear the cookie by setting its value to an empty string and expiry to a past date
      return response.cookie("token", "", cookieOptions).status(200).json({
        message: "Session ended successfully",
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
      });
    }
  }
  
  module.exports = logout;
  