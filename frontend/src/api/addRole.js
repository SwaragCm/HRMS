import axios from "axios";

export const postDesignation = (designationData, successCallback, errorCallback) => {
  const url = `${import.meta.env.VITE_API_URL}/add/role`; // Replace with your backend endpoint
  return axios.post(url, designationData)
    .then((response) => {
      successCallback();
      return response.data;
    })
    .catch((error) => {
      errorCallback(error.response.data);
    });
};
