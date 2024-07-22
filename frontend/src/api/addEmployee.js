import axios from "axios";

export const addEmployee = (employeeData, successCB, errorCB) => {
  const url = `${import.meta.env.VITE_API_URL}/add/employee`;  // Use environment variable
  return axios.post(url, employeeData)
    .then(response => {
      successCB();
      return response.data;
    })
    .catch(error => {
      errorCB(error.response.data);
    });
};
