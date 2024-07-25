import axios from 'axios';

export const deleteEmployee = (employeeId) => {
  const url = `${import.meta.env.VITE_API_URL}/employees/${employeeId}`;
  return axios.post(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; 
    });
};

