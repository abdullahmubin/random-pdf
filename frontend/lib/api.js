/**
 * API Client for communicating with Node.js backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      ...options.headers,
    };

    // Add auth token if available (but not required)
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add content type for JSON
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    // Handle PDF responses
    if (response.headers.get('Content-Type')?.includes('application/pdf')) {
      return response.blob();
    }

    return response.json();
  }

  // Auth endpoints
  async loginWithGoogle(idToken) {
    const data = await this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: idToken }),
    });

    this.setToken(data.token);
    return data;
  }

  async verifyAuth() {
    return this.request('/api/auth/verify');
  }

  logout() {
    this.clearToken();
  }

  // Upload endpoints
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async previewChat(files) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return this.request('/api/preview', {
      method: 'POST',
      body: formData,
    });
  }

  async generatePDF(files) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return this.request('/api/generate-pdf', {
      method: 'POST',
      body: formData,
    });
  }

  async imagesToPDF(files) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return this.request('/api/images-to-pdf', {
      method: 'POST',
      body: formData,
    });
  }

  async mergePDF(files) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return this.request('/api/merge-pdf', {
      method: 'POST',
      body: formData,
    });
  }

  // User endpoints
  async getSubscription() {
    return this.request('/api/user/subscription');
  }

  async getOrders() {
    return this.request('/api/user/orders');
  }

  // Health check
  async health() {
    return this.request('/api/health');
  }
}

// Export singleton instance
export const apiClient = new APIClient();
