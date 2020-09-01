export const setUser = user => {
  localStorage['d-si-user'] = JSON.stringify(user);
  return JSON.parse(localStorage['d-si-user']);
};

export const getUser = () => {
  if (localStorage['d-si-user']) {
    return JSON.parse(localStorage['d-si-user']);
  }
  return null;
};

export const removeUser = () => {
  localStorage.removeItem('d-si-user');
};
