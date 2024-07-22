import axios from "axios";

export const getEmployees = () => {
  const url = `${import.meta.env.VITE_API_URL}/employees`;
  
  return axios.get(url)
    .then(response => {
      return response.data.data;  // Assuming backend returns data in the format { data: [...] }
    })
    .catch(error => {
      console.error("Error fetching employees:", error);
      throw error;  // Handle or throw error as needed
    });
};

