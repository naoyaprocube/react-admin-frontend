import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';

export default (type: any, params: any) => {
  // if (type === AUTH_LOGIN) {
  //   const { username, password } = params;
  //   const request = new Request('/guacamole/api/tokens', {
  //     method: 'POST',
  //     body: "username=" + username + "&password=" + password,
  //     headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
  //   })
  //   return fetch(request)
  //     .then(response => {
  //       if (response.status < 200 || response.status >= 300) {
  //         throw new Error(response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then((json) => {
  //       const { authToken, username } = json
  //       localStorage.setItem('token', authToken);
  //       localStorage.setItem('user', username);
  //     });
  // }
  // if (type === AUTH_LOGOUT) {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   return Promise.resolve();
  // }
  // if (type === AUTH_ERROR) {
  //   // ...
  // }
  if (type === AUTH_CHECK) {
    const username = "guacadmin"
    const password = "guacadmin"
    const tokenRequest = new Request('/guacamole/api/tokens', {
      method: 'POST',
      body: "username=" + username + "&password=" + password,
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    })
    const userRequest = new Request('/guacamole/api/session/data/postgresql/self', {
      method: 'GET',
      headers: new Headers({ "Guacamole-Token": localStorage.getItem('token') }),
    })
    return fetch(tokenRequest)
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
  }
  // if (type === AUTH_GET_PERMISSIONS) {
  //   const user = localStorage.getItem('user');
  //   return user ? Promise.resolve(user) : Promise.reject();
  // }
  return Promise.resolve();
};