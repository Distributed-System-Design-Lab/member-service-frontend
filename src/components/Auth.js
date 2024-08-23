import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Login.css";

const Auth = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log("Component mounted, attempting to store tokens...");
    storeRefreshToken();
    storeAuthCode();
  }, []);

  const login = () => {
    const clientId = "peoplesystem";
    const redirectUri =
      "http://localhost:8081/resource-server/keycloak/redirect";
    const authorizationUrl = `http://localhost:8083/auth/realms/PeopleSystem/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    // Redirect to Keycloak for authentication
    window.location.href = authorizationUrl;
  };

  const storeRefreshToken = () => {
    const refreshTokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("refreshToken="));
    if (refreshTokenCookie) {
      const refreshToken = refreshTokenCookie.split("=")[1];
      console.log("Storing Refresh Token:", refreshToken);
      document.cookie = `refreshToken=${refreshToken}; SameSite=Lax; Secure; HttpOnly;`;
    } else {
      console.log("Refresh Token not found in cookies.");
    }
  };
  const storeAuthCode = () => {
    const authorizationCodeCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("authorizationCode="));
    if (authorizationCodeCookie) {
      const authorizationCode = authorizationCodeCookie.split("=")[1];
      console.log("Storing Authorization Code:", authorizationCode);
      document.cookie = `authorizationCode=${authorizationCode}; SameSite=Lax; Secure; HttpOnly;`;
    } else {
      console.log("Authorization Code not found in cookies.");
    }
  };
  const getRefreshToken = () => {
    const refreshTokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("refreshToken="));
    const refreshToken = refreshTokenCookie
      ? refreshTokenCookie.split("=")[1]
      : null;
    console.log("Retrieved Refresh Token:", refreshToken);
    return refreshToken;
  };

  const getAuthorizationCode = () => {
    const authorizationCodeCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("authorizationCode="));
    const authorizationCode = authorizationCodeCookie
      ? authorizationCodeCookie.split("=")[1]
      : null;
    console.log("Retrieved Authorization Code:", authorizationCode);
    return authorizationCode;
  };

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        console.error("Refresh token is missing.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8081/resource-server/keycloak/logout",
        {
          params: { refreshToken },
        }
      );

      console.log("Logout response:", response.data);

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure;`;
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const authorizationCode = getAuthorizationCode();

      if (!authorizationCode) {
        console.error("Authorization code is missing.");
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/resource-server/keycloak/getUserInfo?authorizationCode=${authorizationCode}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("User info:", response.data);
        setUserInfo(response.data);
      } else {
        console.error("Failed to get user info:", response.data);
      }
    } catch (error) {
      console.error("Error retrieving user info", error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
      <button className="btn btn-logout" onClick={logout}>
        Logout
      </button>
      <button className="btn btn-info" onClick={getUserInfo}>
        Get UserInfo
      </button>

      {userInfo && (
        <div>
          <h3>User Info:</h3>
          <p>Username: {userInfo.preferred_username}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}
    </div>
  );
};

export default Auth;
