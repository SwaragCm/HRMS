import axios from 'axios';

export const deleteDesignation = (designationId) => {
  const url = `${import.meta.env.VITE_API_URL}/designations/${designationId}`;
  
  return axios.delete(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; 
    });
};
