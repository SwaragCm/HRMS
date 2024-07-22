import axios from 'axios';

const login = (username, password) => {
  const url = `${import.meta.env.VITE_API_URL}/login`;

  return axios.post(url, { username, password })
    .then(response => {
      return response.data; // Return the response data
    })
    .catch(error => {
      throw error.response.data; // Throw the error response data
    });
};

export default login;
