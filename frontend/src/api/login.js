import axios from 'axios';

const login = (username, password) => {
  const url = `${import.meta.env.VITE_API_URL}/login`;
  return axios.post(url, { username, password })
    .then(response => {
      return response.data; 

    })
    .catch(error => {
      console.log(error, "error");
      throw error.response.data; 
    });
};

export default login;
