import axios from "axios";

export default axios.create({
  baseURL: "https://formbuilder-qpp8.onrender.com/", // Use proxy instead of direct URL
  withCredentials: true, // allow sending cookies
});
