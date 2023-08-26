// tokenExpiryMiddleware.js

const tokenExpiryMiddleware = store => next => action => {
  console.log(action);
  // Check if the action is a rejected action and if the error message contains status code 401
  if (action.type.endsWith('/rejected') && action.error?.message.includes('Request failed with status code 401')) {
    // Clear the token from local storage
    localStorage.removeItem('access_token');
    
    // Redirect to /login page
    window.location.href = '/login';
  }
  return next(action);
};

export default tokenExpiryMiddleware;