import axios from 'axios';

export const updateEmployee = (employeeId, data) => {
  const url = `${import.meta.env.VITE_API_URL}/employees/${employeeId}`;
  console.log(data, "api employee update data");
  
  return axios.put(url, data)
    .then(response => {
      console.log(response.data, "response data update");
      return response.data;
    })
    .catch(error => {
      throw error.response.data.error; // Adjust error handling as per your API response
    });
};

