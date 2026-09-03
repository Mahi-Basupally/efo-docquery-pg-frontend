import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'DEMO';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    // Response interceptor for rate limit headers
    this.client.interceptors.response.use(
      (response) => {
        // Log rate limit info if available
        const rateLimit = response.headers['x-ratelimit-limit'];
        const rateLimitRemaining = response.headers['x-ratelimit-remaining'];

        if (rateLimit && rateLimitRemaining) {
          console.log(`Rate Limit: ${rateLimitRemaining}/${rateLimit}`);
        }

        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Expose HTTP methods
  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }

  // Handle API errors
  handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; message?: string }>;

      if (axiosError.response) {
        // Server responded with error
        const data = axiosError.response.data;
        return data?.message || data?.error || 'An error occurred';
      } else if (axiosError.request) {
        // Request made but no response
        return 'Unable to connect to the server. Please check if the backend is running.';
      } else {
        // Something else happened
        return axiosError.message;
      }
    }

    return 'An unexpected error occurred';
  }
}

export const apiClient = new ApiClient();