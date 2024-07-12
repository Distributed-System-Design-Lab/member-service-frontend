import React, { useEffect, useState } from 'react';
import AppService from '../services/AppService';
import FooComponent from './FooComponent';

const HomeComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = AppService.checkCredentials();
    setIsLoggedIn(loggedIn);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!loggedIn && code) {
      AppService.retrieveToken(code);
    }
  }, []);

  const login = () => {
    window.location.href = 
      `http://localhost:8083/auth/realms/baeldung/protocol/openid-connect/auth?response_type=code&scope=openid%20write%20read&client_id=${AppService.clientId}&redirect_uri=${AppService.redirectUri}`;
  };

  const logout = () => {
    AppService.logout();
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <button className="btn btn-primary" onClick={login}>Login</button>
      ) : (
        <div className="content">
          <span>Welcome !!</span>
          <button className="btn btn-default pull-right" onClick={logout}>Logout</button>
          <br/>
          <FooComponent />
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
