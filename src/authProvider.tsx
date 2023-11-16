import { AUTH_CHECK } from 'react-admin';

export default (type: any, params: any) => {
  if (type === AUTH_CHECK) {
    const username = "guacadmin"
    const password = "guacadmin"
    const tokenRequest = new Request('/guacamole/api/tokens', {
      method: 'POST',
      body: "username=" + username + "&password=" + password,
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    })
    const fetchToken = () => fetch(tokenRequest)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const { authToken, username } = json
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', username);
      })
      .then(() => Promise.resolve())
      .catch((e: Error) => Promise.reject(e))
    return fetchToken()
  }
  return Promise.resolve();
};