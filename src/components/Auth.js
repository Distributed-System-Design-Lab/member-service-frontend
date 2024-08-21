import React, { useState } from "react";
import "../Login.css";
import axios from "axios";

const Auth = () => {
  const [userInfo] = useState(null);

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
      const response = await axios.get(
        `http://localhost:8081/resource-server/keycloak/logout`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Logged out successfully");
        window.location.href = "/";
      } else {
        console.error("Failed to logout:", response.data);
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // const getUserInfo = async (authorizationCode) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8081/resource-server/keycloak/getUserInfo`,
  //       {
  //         params: {
  //           authorizationCode: authorizationCode,
  //         },
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("User info:", response.data);
  //       setUserInfo(response.data);
  //     } else {
  //       console.error("Failed to get user info:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving user info", error);
  //   }
  // };

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
