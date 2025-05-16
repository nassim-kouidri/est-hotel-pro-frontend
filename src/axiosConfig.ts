import axios from "axios";

// Set up axios interceptors to handle 403 errors
// This function should be called once when the application starts
export const setupAxiosInterceptors = () => {
  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Just return the response
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response && error.response.status === 403) {
        // If we get a 403 error, remove the token and redirect to login
        const user = sessionStorage.getItem("ehp_user");
        if (user) {
          sessionStorage.removeItem("ehp_user");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
