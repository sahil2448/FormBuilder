import axios from "axios";

export default axios.create({
  baseURL: "/", // Use proxy instead of direct URL
  withCredentials: true, // allow sending cookies
});
