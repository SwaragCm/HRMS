import axios from "axios";

export const getEmployees = () => {
  const url = `${import.meta.env.VITE_API_URL}/employees`;
  
  return axios.get(url)
    .then(response => {
      return response.data.data;  
    })
    .catch(error => {
      console.error("Error fetching employees:", error);
      throw error;  
    });
};

