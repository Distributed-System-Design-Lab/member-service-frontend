import React, { useEffect, useState } from "react";
import AppService from "../services/AppService";
import FooComponent from "./FooComponent";

const HomeComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = AppService.checkCredentials();
    setIsLoggedIn(loggedIn);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!loggedIn && code) {
      AppService.retrieveToken(code).then(() => {
        // Clear the authorization code from URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      });
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

  const logout = () => {
    AppService.logout();
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
      ) : (
        <div className="content">
          <span>Welcome !!</span>
          <button className="btn btn-default pull-right" onClick={logout}>
            Logout
          </button>
          <br />
          <FooComponent />
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
