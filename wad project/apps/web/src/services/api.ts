import { ApiResponse } from '@fixnear/shared';

const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('fixnear_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      error: { code: 'PARSE_ERROR', message: 'Unable to parse server response' },
    }));

    if (!res.ok || !data.success) {
      if (res.status === 401 && !window.location.pathname.startsWith('/login')) {
        // Token expired or invalid
        localStorage.removeItem('fixnear_token');
        localStorage.removeItem('fixnear_user');
      }
      throw new ApiError(
        data.error?.code || 'UNKNOWN_ERROR',
        data.error?.message || 'A server error occurred',
        data.error?.details
      );
    }

    return data.data as T;
  }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, String(v));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }

  public async post<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  public async patch<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  public async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(res);
  }
}

export const api = new ApiClient();
