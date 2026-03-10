import { BASE } from './base';

export const authApi = {
  login: async (username, password) => {
    const body = new URLSearchParams({ username, password });
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Invalid username or password');
    }
    return res.json();
  },

  logout: async () => {
    await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' });
  },
};

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const response = await fetch(`${BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    window.location.href = '/';
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  get:    (url)       => request(url),
  post:   (url, data) => request(url, { method: 'POST',   body: JSON.stringify(data) }),
  put:    (url, data) => request(url, { method: 'PUT',    body: JSON.stringify(data) }),
  delete: (url)       => request(url, { method: 'DELETE' }),
};

export const studentsApi = {
  list:    (page = 0, size = 8) => api.get(`/api/students?page=${page}&size=${size}`),
  all:     ()                   => api.get('/api/students/all'),
  getById: (id)                 => api.get(`/api/students/${id}`),
  create:  (data)               => api.post('/api/students', data),
  update:  (id, data)           => api.put(`/api/students/${id}`, data),
  delete:  (id)                 => api.delete(`/api/students/${id}`),
};

export const coursesApi = {
  list:    (page = 0, size = 8) => api.get(`/api/courses?page=${page}&size=${size}`),
  all:     ()                   => api.get('/api/courses/all'),
  getById: (id)                 => api.get(`/api/courses/${id}`),
  create:  (data)               => api.post('/api/courses', data),
  update:  (id, data)           => api.put(`/api/courses/${id}`, data),
};

export const enrollmentsApi = {
  list:    (page = 0, size = 8) => api.get(`/api/enrollments?page=${page}&size=${size}`),
  details: (studentId)          => api.get(`/api/enrollments/${studentId}/details`),
  enroll:  (data)               => api.post('/api/enrollments', data),
};