import axios from 'axios';


const axiosClient = axios.create({
  // baseURL: 'https://app.snoutiq.com/public/api',
  // baseURL: 'http://localhost/smm/backend/public/api',
  // baseURL: 'https://postcraftai.in/public/api',
  baseURL:'https://premate.in/backend/public/api',
    // baseURL: 'http://localhost/React/smm/backend/public/api',

  withCredentials: true, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
 
export default axiosClient;