import axios from "axios";

const API = axios.create({
  baseURL: "http://studentmonitor.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("student-behavior-dashboard-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
