import axios from 'axios';

export const deleteEmployee = (employeeId) => {
  const url = `${import.meta.env.VITE_API_URL}/employees/${employeeId}`;
  console.log(employeeId, "employeeId");
  return axios.post(url)
    .then(response => {
      console.log(response.data, "response data delete");
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; // Adjust error handling as per your API response
    });
};

