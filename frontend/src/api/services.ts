import axiosInstance from './client';
import { User, Position, Course, Enrollment, Subscription, Payment } from '@types/index';

// ============ Auth Services ============
export const authService = {
  register: (name: string, email: string, password: string) =>
    axiosInstance.post('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    axiosInstance.post('/auth/login', { email, password }),

  getCurrentUser: () => axiosInstance.get<{ data: User }>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    axiosInstance.put('/auth/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    axiosInstance.post('/auth/change-password', { oldPassword, newPassword }),
};

// ============ Position Services (Trading) ============
export const positionService = {
  getPositions: (status?: string) =>
    axiosInstance.get<{ data: Position[] }>('/positions', { params: { status } }),

  getPosition: (id: string) =>
    axiosInstance.get<{ data: Position }>(`/positions/${id}`),

  createPosition: (data: Omit<Position, 'id' | 'status' | 'createdAt'>) =>
    axiosInstance.post('/positions', data),

  updatePosition: (id: string, data: Partial<Position>) =>
    axiosInstance.put(`/positions/${id}`, data),

  closePosition: (id: string, exitPrice: number) =>
    axiosInstance.post(`/positions/${id}/close`, { exitPrice }),

  deletePosition: (id: string) =>
    axiosInstance.delete(`/positions/${id}`),

  getStats: () => axiosInstance.get('/positions/stats', {}),
};

// ============ Course Services ============
export const courseService = {
  getCourses: (category?: string) =>
    axiosInstance.get<{ data: Course[] }>('/courses', { params: { category } }),

  getCourse: (id: string) =>
    axiosInstance.get<{ data: Course }>(`/courses/${id}`),

  createCourse: (data: Omit<Course, 'id'>) =>
    axiosInstance.post('/courses', data),

  updateCourse: (id: string, data: Partial<Course>) =>
    axiosInstance.put(`/courses/${id}`, data),

  deleteCourse: (id: string) =>
    axiosInstance.delete(`/courses/${id}`),

  enrollCourse: (courseId: string) =>
    axiosInstance.post(`/courses/${courseId}/enroll`, {}),

  getEnrollments: () =>
    axiosInstance.get<{ data: Enrollment[] }>('/courses/user/enrollments'),
};

// ============ User Services (Admin) ============
export const userService = {
  getAllUsers: (page?: number, limit?: number) =>
    axiosInstance.get<{ data: User[] }>('/users', { params: { page, limit } }),

  getUser: (id: string) =>
    axiosInstance.get<{ data: User }>(`/users/${id}`),

  updateUser: (id: string, data: Partial<User>) =>
    axiosInstance.put(`/users/${id}`, data),

  deleteUser: (id: string) =>
    axiosInstance.delete(`/users/${id}`),

  updateRole: (id: string, role: string) =>
    axiosInstance.put(`/users/${id}`, { role }),

  updatePlan: (id: string, plan: string) =>
    axiosInstance.put(`/users/${id}`, { plan }),
};

// ============ Payment Services ============
export const paymentService = {
  createSubscription: (planId: string) =>
    axiosInstance.post('/payments/subscribe', { planId }),

  getSubscription: () =>
    axiosInstance.get<{ data: Subscription }>('/payments/subscription'),

  changePlan: (newPlan: string) =>
    axiosInstance.put('/payments/subscription/change-plan', { plan: newPlan }),

  cancelSubscription: () =>
    axiosInstance.delete('/payments/subscription'),

  getInvoices: () =>
    axiosInstance.get('/payments/invoices'),

  getPaymentMethods: () =>
    axiosInstance.get('/payments/payment-methods'),

  addPaymentMethod: (token: string) =>
    axiosInstance.post('/payments/payment-methods', { token }),

  deletePaymentMethod: (methodId: string) =>
    axiosInstance.delete(`/payments/payment-methods/${methodId}`),
};

// ============ Analytics Services (Admin) ============
export const analyticsService = {
  getDashboard: () =>
    axiosInstance.get('/analytics/dashboard'),

  getUserStats: () =>
    axiosInstance.get('/analytics/users'),

  getRevenueStats: () =>
    axiosInstance.get('/analytics/revenue'),

  getEngagementStats: () =>
    axiosInstance.get('/analytics/engagement'),
};

// ============ Article Services ============
export const articleService = {
  getArticles: (section?: string) =>
    axiosInstance.get('/articles', { params: { section } }),

  getArticle: (id: string) =>
    axiosInstance.get(`/articles/${id}`),

  createArticle: (data: any) =>
    axiosInstance.post('/articles', data),

  updateArticle: (id: string, data: any) =>
    axiosInstance.put(`/articles/${id}`, data),

  deleteArticle: (id: string) =>
    axiosInstance.delete(`/articles/${id}`),
};

// ============ File Services ============
export const fileService = {
  getFiles: (category?: string) =>
    axiosInstance.get('/files', { params: { category } }),

  uploadFile: (formData: FormData) =>
    axiosInstance.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteFile: (id: string) =>
    axiosInstance.delete(`/files/${id}`),
};
