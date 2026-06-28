import axios from 'axios';
import { requestInterceptor, errorInterceptor } from './interceptors';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
});

api.interceptors.request.use(requestInterceptor, errorInterceptor);

export default api;
