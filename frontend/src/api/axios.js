import axios from "axios";

export default axios.create({
  baseURL: "/api", // Use proxy instead of direct URL
  withCredentials: true, // allow sending cookies
});
