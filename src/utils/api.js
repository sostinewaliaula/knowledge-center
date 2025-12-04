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

  // Generic HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
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

  async createRole(roleData) {
    const response = await this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    return response.role;
  },

  async updateRole(id, roleData) {
    const response = await this.request(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    return response.role;
  },

  async deleteRole(id) {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
  },

  async getPermissions() {
    const response = await this.request('/permissions');
    return response.permissions || [];
  },

  async updateRolePermissions(id, permissionKeys) {
    return this.request(`/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permission_keys: permissionKeys }),
    });
  },

  async createRole(roleData) {
    const response = await this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    return response.role;
  },

  async updateRole(id, roleData) {
    const response = await this.request(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    return response.role;
  },

  async deleteRole(id) {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
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

  async uploadContent(file, title, description, categoryId, isPublic, tags = null) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (categoryId) formData.append('category_id', categoryId);
    if (isPublic !== undefined) formData.append('is_public', isPublic);
    if (tags && tags.size > 0) {
      formData.append('tags', JSON.stringify(Array.from(tags)));
    }

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

  async addContentFromUrl(url, title, description, categoryId, isPublic, tags = null) {
    const requestData = {
      url,
      title,
      description,
      category_id: categoryId,
      is_public: isPublic
    };
    if (tags && tags.size > 0) {
      requestData.tags = Array.from(tags);
    }
    return this.request('/content/url', {
      method: 'POST',
      body: JSON.stringify(requestData),
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
  },

  // ============================================
  // LEARNING PATH API METHODS
  // ============================================

  async getLearningPaths(page = 1, limit = 20, search = '', status = 'all') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    const queryString = params.toString();
    return this.request(`/learning-paths${queryString ? `?${queryString}` : ''}`);
  },

  async getLearningPath(id) {
    const response = await this.request(`/learning-paths/${id}`);
    return response.path;
  },

  async createLearningPath(pathData) {
    const response = await this.request('/learning-paths', {
      method: 'POST',
      body: JSON.stringify(pathData),
    });
    return response.path;
  },

  async updateLearningPath(id, pathData) {
    const response = await this.request(`/learning-paths/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pathData),
    });
    return response.path;
  },

  async deleteLearningPath(id) {
    return this.request(`/learning-paths/${id}`, {
      method: 'DELETE',
    });
  },

  async addCourseToPath(pathId, courseId, orderIndex = null, isRequired = true) {
    return this.request(`/learning-paths/${pathId}/courses`, {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId, order_index: orderIndex, is_required: isRequired }),
    });
  },

  async removeCourseFromPath(pathId, courseId) {
    return this.request(`/learning-paths/${pathId}/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  async reorderCoursesInPath(pathId, courseIds) {
    return this.request(`/learning-paths/${pathId}/courses/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ courseIds }),
    });
  },

  async updateCourseRequirement(pathId, courseId, isRequired) {
    return this.request(`/learning-paths/${pathId}/courses/${courseId}/requirement`, {
      method: 'PUT',
      body: JSON.stringify({ is_required: isRequired }),
    });
  },

  // ============================================
  // CATEGORY API METHODS
  // ============================================

  async getCategories(page = 1, limit = 100, search = '', parentId = null) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (parentId !== null) params.append('parent_id', parentId);
    const queryString = params.toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ''}`);
  },

  async getCategory(id) {
    const response = await this.request(`/categories/${id}`);
    return response.category;
  },

  async getCategoryChildren(id) {
    const response = await this.request(`/categories/${id}/children`);
    return response.categories;
  },

  async createCategory(categoryData) {
    const response = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.category;
  },

  async updateCategory(id, categoryData) {
    const response = await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.category;
  },

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // ============================================
  // TAG API METHODS
  // ============================================

  async getTags(page = 1, limit = 100, search = '') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return this.request(`/tags${queryString ? `?${queryString}` : ''}`);
  },

  async getTag(id) {
    const response = await this.request(`/tags/${id}`);
    return response.tag;
  },

  async createTag(tagData) {
    const response = await this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
    return response.tag;
  },

  async updateTag(id, tagData) {
    const response = await this.request(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
    return response.tag;
  },

  async deleteTag(id) {
    return this.request(`/tags/${id}`, {
      method: 'DELETE',
    });
  },

  // Template API methods
  async getTemplates(page = 1, limit = 20, search = '', type = 'all', isPublic = null) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (type && type !== 'all') params.append('type', type);
    if (isPublic !== null) params.append('isPublic', isPublic);
    const queryString = params.toString();
    return this.request(`/templates${queryString ? `?${queryString}` : ''}`);
  },

  async getTemplate(id) {
    const response = await this.request(`/templates/${id}`);
    return response.template;
  },

  async createTemplate(templateData) {
    const response = await this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
    return response.template;
  },

  async updateTemplate(id, templateData) {
    const response = await this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
    return response.template;
  },

  async deleteTemplate(id) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  },

  async useTemplate(id, title = null, description = null) {
    const response = await this.request(`/templates/${id}/use`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
    return response;
  },

  // Assessment API methods
  async getAssessments(page = 1, limit = 20, search = '', status = 'all', type = 'all') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (type && type !== 'all') params.append('type', type);
    const queryString = params.toString();
    return this.request(`/assessments${queryString ? `?${queryString}` : ''}`);
  },

  async getAssessment(id) {
    const response = await this.request(`/assessments/${id}`);
    return response.assessment;
  },

  async getAssessmentsByCourse(courseId) {
    const response = await this.request(`/assessments/course/${courseId}`);
    return response.assessments || [];
  },

  async getAssessmentsByLesson(lessonId) {
    const response = await this.request(`/assessments/lesson/${lessonId}`);
    return response.assessments || [];
  },

  async createAssessment(assessmentData) {
    const response = await this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
    return response.assessment;
  },

  async updateAssessment(id, assessmentData) {
    const response = await this.request(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    });
    return response.assessment;
  },

  async deleteAssessment(id) {
    return this.request(`/assessments/${id}`, {
      method: 'DELETE',
    });
  },

  // Question methods
  async getQuestions(assessmentId) {
    const response = await this.request(`/assessments/${assessmentId}/questions`);
    return response.questions;
  },

  async createQuestion(assessmentId, questionData) {
    const response = await this.request(`/assessments/${assessmentId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async updateQuestion(questionId, questionData) {
    const response = await this.request(`/assessments/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async deleteQuestion(questionId) {
    return this.request(`/assessments/questions/${questionId}`, {
      method: 'DELETE',
    });
  },

  async reorderQuestions(assessmentId, questionOrders) {
    return this.request(`/assessments/${assessmentId}/questions/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ questionOrders }),
    });
  },

  async publishQuestion(questionId) {
    const response = await this.request(`/assessments/questions/${questionId}/publish`, {
      method: 'PUT',
    });
    return response.question;
  },

  async unpublishQuestion(questionId) {
    const response = await this.request(`/assessments/questions/${questionId}/unpublish`, {
      method: 'PUT',
    });
    return response.question;
  },

  async getQuestionHistory(questionId) {
    const response = await this.request(`/assessments/questions/${questionId}/history`);
    return response.history;
  },

  // Assignments endpoints
  async getAssignments(page = 1, limit = 20, search = '', status = 'all', type = 'all') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    const queryString = params.toString();
    const response = await this.request(`/assignments${queryString ? `?${queryString}` : ''}`);
    return {
      assignments: response.assignments || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1
    };
  },

  async getAssignment(id) {
    const response = await this.request(`/assignments/${id}`);
    return response.assignment;
  },

  async getAssignmentsByCourse(courseId) {
    const response = await this.request(`/assignments/course/${courseId}`);
    return response.assignments || [];
  },

  async getAssignmentsByLesson(lessonId) {
    const response = await this.request(`/assignments/lesson/${lessonId}`);
    return response.assignments || [];
  },

  // Assignment questions (quiz-style)
  async getAssignmentQuestions(assignmentId) {
    const response = await this.request(`/assignments/${assignmentId}/questions`);
    return response.questions;
  },

  async createAssignmentQuestion(assignmentId, questionData) {
    const response = await this.request(`/assignments/${assignmentId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async updateAssignmentQuestion(questionId, questionData) {
    const response = await this.request(`/assignments/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async deleteAssignmentQuestion(questionId) {
    return this.request(`/assignments/questions/${questionId}`, {
      method: 'DELETE',
    });
  },

  async reorderAssignmentQuestions(assignmentId, questionOrders) {
    return this.request(`/assignments/${assignmentId}/questions/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ questionOrders }),
    });
  },

  async createAssignment(assignmentData) {
    const response = await this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
    return response.assignment;
  },

  async updateAssignment(id, assignmentData) {
    const response = await this.request(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
    return response.assignment;
  },

  async deleteAssignment(id) {
    return this.request(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  // Exams endpoints
  async getExams(page = 1, limit = 20, search = '', status = 'all') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const queryString = params.toString();
    const response = await this.request(`/exams${queryString ? `?${queryString}` : ''}`);
    return {
      exams: response.exams || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1
    };
  },



  // ============================================
  // USER GROUPS API METHODS
  // ============================================

  async getUserGroups(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return this.request(`/user-groups${queryString ? `?${queryString}` : ''}`);
  },

  async createUserGroup(groupData) {
    return this.request('/user-groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  async updateUserGroup(id, groupData) {
    return this.request(`/user-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  },

  async deleteUserGroup(id) {
    return this.request(`/user-groups/${id}`, {
      method: 'DELETE',
    });
  },

  async getGroupMembers(groupId) {
    return this.request(`/user-groups/${groupId}/members`);
  },

  async addGroupMember(groupId, userId) {
    return this.request(`/user-groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async removeGroupMember(groupId, userId) {
    return this.request(`/user-groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    });
  },

  // ============================================
  // COURSE ASSIGNMENTS API METHODS
  // ============================================

  async createCourseAssignment(assignmentData) {
    return this.request('/course-assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  async getUserCourseAssignments(userId) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    return this.request(`/course-assignments/user?${params.toString()}`);
  },

  async getCourseAssignments(courseId) {
    return this.request(`/course-assignments/course/${courseId}`);
  },

  async deleteCourseAssignment(id) {
    return this.request(`/course-assignments/${id}`, {
      method: 'DELETE',
    });
  },


  async getExam(id) {
    const response = await this.request(`/exams/${id}`);
    return response.exam;
  },

  async getExamsByCourse(courseId) {
    const response = await this.request(`/exams/course/${courseId}`);
    return response.exams || [];
  },

  async createExamQuestion(examId, questionData) {
    const response = await this.request(`/exams/${examId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async updateExamQuestion(questionId, questionData) {
    const response = await this.request(`/exams/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
    return response.question;
  },

  async deleteExamQuestion(questionId) {
    return this.request(`/exams/questions/${questionId}`, {
      method: 'DELETE',
    });
  },

  async reorderExamQuestions(examId, questionOrders) {
    return this.request(`/exams/${examId}/questions/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ questionOrders }),
    });
  },

  async publishExamQuestion(questionId) {
    const response = await this.request(`/exams/questions/${questionId}/publish`, {
      method: 'PUT',
    });
    return response.question;
  },

  async unpublishExamQuestion(questionId) {
    const response = await this.request(`/exams/questions/${questionId}/unpublish`, {
      method: 'PUT',
    });
    return response.question;
  },

  async getExamQuestionHistory(questionId) {
    const response = await this.request(`/exams/questions/${questionId}/history`);
    return response.history;
  },

  // Live Sessions endpoints
  async getLiveSessions(status = '', search = '') {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return this.request(`/live-sessions${queryString ? `?${queryString}` : ''}`);
  },

  async getLiveSession(id) {
    return this.request(`/live-sessions/${id}`);
  },

  async createLiveSession(sessionData) {
    return this.request('/live-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  async updateLiveSession(id, sessionData) {
    return this.request(`/live-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  async deleteLiveSession(id) {
    return this.request(`/live-sessions/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings
  async getSettings() {
    return this.request('/settings');
  },

  async updateSettings(category, settings) {
    return this.request(`/settings/${category}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
};

