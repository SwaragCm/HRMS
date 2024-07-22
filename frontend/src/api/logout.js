import axios from 'axios';

const logout = () => {
  const url = `${import.meta.env.VITE_API_URL}/logout`;

  return axios.post(url)
    .then(() => {
      localStorage.removeItem('username');
    })
    .catch(error => {
      throw error.response.data;
    });
};

export default logout;

