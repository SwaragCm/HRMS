import axios from "axios";

export const getDesignations = () => {
  const url = `${import.meta.env.VITE_API_URL}/designations`;  
  return axios.get(url)
    .then(response => {
      return response.data;  
    })
    .catch(error => {
      console.error("Error fetching designations:", error);
      throw error;  
    });
};
