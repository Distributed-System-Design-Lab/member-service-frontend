import axios from 'axios';
import Cookies from 'js-cookie';

class AppService {
  constructor() {
    this.clientId = 'newClient';
    this.redirectUri = 'http://localhost:8089/';
  }

  retrieveToken(code) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code);

    axios.post('http://localhost:8083/auth/realms/baeldung/protocol/openid-connect/token', params)
      .then(response => this.saveToken(response.data))
      .catch(error => alert('Invalid Credentials'));
  }

  saveToken(token) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookies.set('access_token', token.access_token, { expires: new Date(expireDate) });
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:8089';
  }

  getResource(resourceUrl) {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + Cookies.get('access_token')
    };

    return axios.get(resourceUrl, { headers }).catch(error => {
      throw new Error(error.response.data.error || 'Server error');
    });
  }

  checkCredentials() {
    return Cookies.get('access_token') !== undefined;
  }

  logout() {
    Cookies.remove('access_token');
    window.location.reload();
  }
}

export default new AppService();
