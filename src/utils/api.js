const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Backend returns { success: true, token, user }
    // Return just token and user for compatibility
    return {
      token: response.token,
      user: response.user
    };
  },

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resetPassword(email, otp, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  // Users endpoints
  async getUsers(page = 1, limit = 100, search = '') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  },

  async getUser(id) {
    const response = await this.request(`/users/${id}`);
    return response.user;
  },

  async createUser(userData) {
    const response = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.user;
  },

  async updateUser(id, userData) {
    const response = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.user;
  },

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Roles endpoints
  async getRoles() {
    const response = await this.request('/roles');
    return response.roles || [];
  },

  async getRole(id) {
    const response = await this.request(`/roles/${id}`);
    return response.role;
  },

  // Content endpoints
  async getContents(page = 1, limit = 20, search = '', filterType = 'all') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (filterType && filterType !== 'all') params.append('filterType', filterType);
    const queryString = params.toString();
    return this.request(`/content${queryString ? `?${queryString}` : ''}`);
  },

  async getContent(id) {
    const response = await this.request(`/content/${id}`);
    return response.content;
  },

  async uploadContent(file, title, description, categoryId, isPublic) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('authToken');
    
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (categoryId) formData.append('category_id', categoryId);
    if (isPublic !== undefined) formData.append('is_public', isPublic);

    const response = await fetch(`${API_BASE_URL}/content/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data.content;
  },

  async addContentFromUrl(url, title, description, categoryId, isPublic) {
    return this.request('/content/url', {
      method: 'POST',
      body: JSON.stringify({
        url,
        title,
        description,
        category_id: categoryId,
        is_public: isPublic
      }),
    }).then(response => response.content);
  },

  async updateContent(id, contentData) {
    const response = await this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
    return response.content;
  },

  async deleteContent(id) {
    return this.request(`/content/${id}`, {
      method: 'DELETE',
    });
  },

  getContentDownloadUrl(id, view = false) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('authToken');
    
    // For viewing, use the public view endpoint
    if (view) {
      return `${API_BASE_URL}/content/${id}/view?token=${token}`;
    }
    
    // For downloading, use the download endpoint
    return `${API_BASE_URL}/content/${id}/download?token=${token}`;
  },

  // ============================================
  // COURSE API METHODS
  // ============================================

  async getCourses(page = 1, limit = 20, search = '', status = 'all', categoryId = null) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (categoryId) params.append('category_id', categoryId);
    const queryString = params.toString();
    return this.request(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  async getCourse(id) {
    const response = await this.request(`/courses/${id}`);
    return response.course;
  },

  async createCourse(courseData) {
    const response = await this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return response.course;
  },

  async updateCourse(id, courseData) {
    const response = await this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
    return response.course;
  },

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  },

  // Module methods
  async createModule(courseId, moduleData) {
    const response = await this.request(`/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
    return response.module;
  },

  async updateModule(moduleId, moduleData) {
    const response = await this.request(`/courses/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });
    return response.module;
  },

  async deleteModule(moduleId) {
    return this.request(`/courses/modules/${moduleId}`, {
      method: 'DELETE',
    });
  },

  async reorderModules(courseId, moduleOrders) {
    const response = await this.request(`/courses/${courseId}/modules/reorder`, {
      method: 'POST',
      body: JSON.stringify({ moduleOrders }),
    });
    return response.modules;
  },

  // Lesson methods
  async createLesson(moduleId, lessonData) {
    const response = await this.request(`/courses/modules/${moduleId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
    return response.lesson;
  },

  async updateLesson(lessonId, lessonData) {
    const response = await this.request(`/courses/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
    return response.lesson;
  },

  async deleteLesson(lessonId) {
    return this.request(`/courses/lessons/${lessonId}`, {
      method: 'DELETE',
    });
  },

  async reorderLessons(moduleId, lessonOrders) {
    const response = await this.request(`/courses/modules/${moduleId}/lessons/reorder`, {
      method: 'POST',
      body: JSON.stringify({ lessonOrders }),
    });
    return response.lessons;
  }
};

