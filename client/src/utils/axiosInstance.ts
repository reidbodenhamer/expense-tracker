import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL, ROUTE_PREFIX } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // handle common errors globally
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - redirecting to login");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = `${ROUTE_PREFIX}/login`;
      }
    } else if (error.response && error.response.status === 500) {
      console.error("Server error - please try again later");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out - please try again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
