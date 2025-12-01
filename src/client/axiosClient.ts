import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthHeaders } from '../lib/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:17000/api/v1',
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authorization header
 */
apiClient.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders();
  if (authHeaders['Authorization']) {
    config.headers['Authorization'] = authHeaders['Authorization'];
  }
  console.log('📤 Request:', {
    url: config.url,
    method: config.method,
    hasAuth: !!config.headers['Authorization'],
  });
  return config;
});

/**
 * Response interceptor to handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    const errorInfo = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      url: error.config?.url,
    };
    console.error('❌ API Error:', errorInfo);
    
    // Ensure error is properly rejected
    return Promise.reject(new Error(errorInfo.message || 'API request failed'));
  }
);

/**
 * HTTP GET request
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return apiClient.get<T>(url, config);
};

/**
 * HTTP POST request
 */
export const post = async <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return apiClient.post<T>(url, data, config);
};

/**
 * HTTP PUT request
 */
export const put = async <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return apiClient.put<T>(url, data, config);
};

/**
 * HTTP DELETE request
 */
export const remove = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return apiClient.delete<T>(url, config);
};

export default apiClient;

