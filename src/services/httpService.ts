import axios, { AxiosError } from "axios";
import { apiURL } from "@/config/constants";
import Swal from "sweetalert2";

//base URL
axios.defaults.baseURL = apiURL;

axios.interceptors.response.use(null, (error: AxiosError) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An unexpected error occurred.",
    });
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
