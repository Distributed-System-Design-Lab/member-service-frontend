// src\components\Login.js
import React from "react";

const Login = () => {
  const login = () => {
    const clientId = "peoplesystem";
    const redirectUri =
      "http://localhost:8081/resource-server/keycloak/redirect";
    const authorizationUrl = `http://localhost:8083/auth/realms/PeopleSystem/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = authorizationUrl;
  };

  return (
    <button className="btn btn-primary" onClick={login}>
      Login
    </button>
  );
};

export default Login;
