// Reads the CSRF token injected by Spring Security into the page meta tags
function getCsrfToken() {
  const meta = document.querySelector('meta[name="_csrf"]');
  return meta ? meta.getAttribute('content') : null;
}

function getCsrfHeader() {
  const meta = document.querySelector('meta[name="_csrf_header"]');
  return meta ? meta.getAttribute('content') : 'X-CSRF-TOKEN';
}

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const token = getCsrfToken();
  if (token && ['POST', 'PUT', 'DELETE', 'PATCH'].includes((options.method || 'GET').toUpperCase())) {
    headers[getCsrfHeader()] = token;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    window.location.href = '/login';
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
  get: (url) => request(url),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentsApi = {
  list: (page = 0, size = 8) => api.get(`/api/students?page=${page}&size=${size}`),
  all: () => api.get('/api/students/all'),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (data) => api.post('/api/students', data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
};

// ── Courses ───────────────────────────────────────────────────────────────────
export const coursesApi = {
  list: (page = 0, size = 8) => api.get(`/api/courses?page=${page}&size=${size}`),
  all: () => api.get('/api/courses/all'),
  getById: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post('/api/courses', data),
  update: (id, data) => api.put(`/api/courses/${id}`, data),
};

// ── Enrollments ───────────────────────────────────────────────────────────────
export const enrollmentsApi = {
  list: (page = 0, size = 8) => api.get(`/api/enrollments?page=${page}&size=${size}`),
  details: (studentId) => api.get(`/api/enrollments/${studentId}/details`),
  enroll: (data) => api.post('/api/enrollments', data),
};