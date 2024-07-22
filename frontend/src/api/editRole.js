import axios from 'axios';

export const updateDesignation = (designationId, data) => {
  const url = `${import.meta.env.VITE_API_URL}/designations/${designationId}`;
  
  return axios.put(url, data)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; // Adjust error handling as per your API response
    });
};

