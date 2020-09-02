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

export const getUserPlan = () => {
  if (localStorage['d-si-user-plan']) {
    return JSON.parse(localStorage['d-si-user-plan']);
  }
  return null;
};

export const setUserPlan = plan => {
  localStorage['d-si-user-plan'] = plan;
  return JSON.parse(localStorage['d-si-user-plan']);
};

export const removeUser = () => {
  localStorage.removeItem('d-si-user');
  localStorage.removeItem('d-si-user-plan');
};
