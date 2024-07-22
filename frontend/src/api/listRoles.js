import axios from "axios";

export const getDesignations = () => {
  const url = `${import.meta.env.VITE_API_URL}/designations`;  // Utilize environment variable
  return axios.get(url)
    .then(response => {
      return response.data;  // Assuming backend returns data directly
    })
    .catch(error => {
      console.error("Error fetching designations:", error);
      throw error;  // Handle or throw error as needed
    });
};
