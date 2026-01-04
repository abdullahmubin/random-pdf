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

  // generatePDF with optional progress callback (onProgress receives percent 0-100)
  async generatePDF(files, onProgress) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    // Use XMLHttpRequest to support upload progress events
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_URL}/api/generate-pdf`;
      xhr.open('POST', url, true);
      const token = this.getToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.responseType = 'blob';

      xhr.upload.onprogress = function(e) {
        if (typeof onProgress === 'function') {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            try { onProgress(percent, e.loaded, e.total); } catch (err) { /* ignore callback errors */ }
          } else {
            // length not computable — provide a best-effort signal
            try { onProgress(0, e.loaded || 0, e.total || 0); } catch (err) { }
          }
        }
      };

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          // Attempt to parse JSON error from responseText
          let msg = `HTTP ${xhr.status}`;
          try {
            const txt = xhr.response && typeof xhr.response === 'string' ? xhr.response : xhr.responseText;
            const json = txt ? JSON.parse(txt) : null;
            if (json && json.error) msg = json.error;
          } catch (e) {}
          reject(new Error(msg));
        }
      };

      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Request timed out')); };
      xhr.send(formData);
    });
  }

  async imagesToPDF(files) {
    // backward-compatible wrapper: call XHR version without progress
    return this.imagesToPDFWithProgress(files);
  }

  // XHR-based imagesToPDF with optional progress callback
  async imagesToPDFWithProgress(files, onProgress) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_URL}/api/images-to-pdf`;
      xhr.open('POST', url, true);
      const token = this.getToken();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.responseType = 'blob';

      xhr.upload.onprogress = function(e) {
        if (typeof onProgress === 'function') {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            try { onProgress(percent, e.loaded, e.total); } catch (err) { }
          } else {
            try { onProgress(0, e.loaded || 0, e.total || 0); } catch (err) { }
          }
        }
      };

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          let msg = `HTTP ${xhr.status}`;
          try {
            const txt = xhr.response && typeof xhr.response === 'string' ? xhr.response : xhr.responseText;
            const json = txt ? JSON.parse(txt) : null;
            if (json && json.error) msg = json.error;
          } catch (e) {}
          reject(new Error(msg));
        }
      };

      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Request timed out')); };
      xhr.send(formData);
    });
  }

  async mergePDF(files) {
    // backward-compatible wrapper
    return this.mergePDFWithProgress(files);
  }

  // XHR-based mergePDF with optional progress callback
  async mergePDFWithProgress(files, onProgress) {
    const formData = new FormData();
    if (files instanceof File || (typeof File !== 'undefined' && files instanceof File)) {
      formData.append('file', files);
    } else if (files && files.length) {
      for (const f of files) formData.append('file', f);
    } else {
      throw new Error('No files provided');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_URL}/api/merge-pdf`;
      xhr.open('POST', url, true);
      const token = this.getToken();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.responseType = 'blob';

      xhr.upload.onprogress = function(e) {
        if (typeof onProgress === 'function') {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            try { onProgress(percent, e.loaded, e.total); } catch (err) { }
          } else {
            try { onProgress(0, e.loaded || 0, e.total || 0); } catch (err) { }
          }
        }
      };

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          let msg = `HTTP ${xhr.status}`;
          try {
            const txt = xhr.response && typeof xhr.response === 'string' ? xhr.response : xhr.responseText;
            const json = txt ? JSON.parse(txt) : null;
            if (json && json.error) msg = json.error;
          } catch (e) {}
          reject(new Error(msg));
        }
      };

      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Request timed out')); };
      xhr.send(formData);
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
