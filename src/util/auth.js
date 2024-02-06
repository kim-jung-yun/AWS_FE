export function getAuthToken() {
  const token = localStorage.getItem('jwtauthtoken');
  //console.log("token: " ,  token);
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}