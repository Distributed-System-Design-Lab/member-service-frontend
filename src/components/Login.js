import React, { useState, useEffect } from "react";
import "../Login.css";

const Login = () => {
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    sessionStorage.getItem("refreshToken") || null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessTokenFromUrl = params.get("token");
    const refreshTokenFromUrl = params.get("refreshToken");

    if (accessTokenFromUrl && refreshTokenFromUrl) {
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
    if (!accessToken || !refreshToken) {
      console.log("No tokens available for logout");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/resource-server/keycloak/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            accessToken: accessToken,
            refreshToken: refreshToken,
          }),
        }
      );

      // Check if response is OK
      if (response.ok) {
        console.log("Logged out successfully");
        setAccessToken(null);
        setRefreshToken(null);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        window.location.href = "http://localhost:3000";
      } else {
        const errorText = await response.text();
        console.error("Failed to logout:", errorText);
      }
    } catch (error) {
      console.error("Error during logout", error);
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
    </div>
  );
};

export default Login;
