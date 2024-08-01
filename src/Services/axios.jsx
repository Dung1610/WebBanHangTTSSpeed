import axios from "axios";
const baseURL = "http://localhost:5181/api/";
const myAxios = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 120,
});
// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return alert("Yêu cầu quá hạn \nKiểm tra kết nối mạng");
  // return Promise.reject(error);
});
export { myAxios, baseURL };