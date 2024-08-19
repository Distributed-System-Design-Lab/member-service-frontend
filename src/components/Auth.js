import React, { useState, useEffect } from "react";
import "../Login.css";

const Auth = () => {
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    sessionStorage.getItem("refreshToken") || null
  );
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessTokenFromUrl = params.get("token");
    const refreshTokenFromUrl = params.get("refreshToken");
    const authorizationCode = params.get("code");

    if (authorizationCode && !accessTokenFromUrl) {
      getUserInfo(authorizationCode);
    } else if (accessTokenFromUrl && refreshTokenFromUrl) {
      setAccessToken(accessTokenFromUrl);
      setRefreshToken(refreshTokenFromUrl);
      sessionStorage.setItem("accessToken", accessTokenFromUrl);
      sessionStorage.setItem("refreshToken", refreshTokenFromUrl);
    }
  }, []);

  const login = () => {
    const clientId = "peoplesystem";
    const redirectUri =
      "http://localhost:8081/resource-server/keycloak/redirect";
    const authorizationUrl = `http://localhost:8083/auth/realms/PeopleSystem/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = authorizationUrl;
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/resource-server/keycloak/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.ok) {
        console.log("Logged out successfully");
        setUserInfo(null);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      } else {
        const errorText = await response.text();
        console.error("Failed to logout:", errorText);
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const getUserInfo = async (authorizationCode) => {
    try {
      const response = await fetch(
        `http://localhost:8081/resource-server/keycloak/getUserInfo?authorizationCode=${authorizationCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userInfo = await response.json();
        console.log("User info:", userInfo);
        setUserInfo(userInfo);
      } else {
        const errorText = await response.text();
        console.error("Failed to get user info:", errorText);
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
