import axios from 'axios';

export const updateEmployee = (employeeId, data) => {
  const url = `${import.meta.env.VITE_API_URL}/employees/${employeeId}`;
  
  return axios.put(url, data)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error;
    });
};

