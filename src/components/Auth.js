import React, { useState } from "react";
import axios from "axios";
import "../Login.css";

const Auth = () => {
  const [userInfo, setUserInfo] = useState(null);

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

  const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
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

      console.log(response.data);

      // Clear the tokens after logout
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/resource-server/keycloak/getUserInfo`,
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
