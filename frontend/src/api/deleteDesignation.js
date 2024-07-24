import axios from 'axios';

export const deleteDesignation = (designationId) => {
  const url = `${import.meta.env.VITE_API_URL}/designations/${designationId}`;
  console.log(designationId, "designationId");
  return axios.delete(url)
    .then(response => {
      console.log(response.data, "response data delete");
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; 
    });
};
