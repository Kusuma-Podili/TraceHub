// SDLC Enterprise API Client & Utilities

const API = {
  getToken() {
    return localStorage.getItem("sdlc_token");
  },

  setToken(token) {
    localStorage.setItem("sdlc_token", token);
  },

  clearToken() {
    localStorage.removeItem("sdlc_token");
    localStorage.removeItem("sdlc_user");
  },

  getUser() {
    const raw = localStorage.getItem("sdlc_user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem("sdlc_user", JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      });

      if (response.status === 401) {
        this.clearToken();
        if (window.App && typeof window.App.renderAuthView === "function") {
          window.App.renderAuthView();
        }
        throw new Error("Session expired. Please log in again.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || "An unexpected error occurred.");
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Toast Notification
  toast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 200);
    }, 4000);
  },

  // Auth Endpoints
  auth: {
    login: (creds) => API.request("/api/auth/login", { method: "POST", body: JSON.stringify(creds) }),
    register: (payload) => API.request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    me: () => API.request("/api/auth/me"),
    logout: () => API.request("/api/auth/logout", { method: "POST" }),
    forgotPassword: (payload) => API.request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
    getUsers: (role) => API.request(role ? `/api/auth/users?role=${encodeURIComponent(role)}` : "/api/auth/users"),
  },

  // Projects Endpoints
  projects: {
    list: () => API.request("/api/projects"),
    get: (id) => API.request(`/api/projects/${id}`),
    create: (payload) => API.request("/api/projects", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => API.request(`/api/projects/${id}`, { method: "DELETE" }),
    addMember: (id, payload) => API.request(`/api/projects/${id}/members`, { method: "POST", body: JSON.stringify(payload) }),
    removeMember: (projId, userId) => API.request(`/api/projects/${projId}/members/${userId}`, { method: "DELETE" }),
    getActivity: (id) => API.request(`/api/projects/${id}/activity`),
  },

  // SDLC Phases
  phases: {
    get: (projectId) => API.request(`/api/projects/${projectId}/phases`),
    getReadiness: (projectId) => API.request(`/api/projects/${projectId}/phases/readiness`),
    advance: (projectId, targetPhase) => API.request(`/api/projects/${projectId}/phases/advance`, {
      method: "POST",
      body: JSON.stringify({ target_phase: targetPhase })
    }),
  },

  // Requirements
  requirements: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/requirements${q ? '?' + q : ''}`);
    },
    get: (id) => API.request(`/api/requirements/${id}`),
    create: (payload) => API.request("/api/requirements", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/requirements/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => API.request(`/api/requirements/${id}`, { method: "DELETE" }),
  },

  // Tasks
  tasks: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/tasks${q ? '?' + q : ''}`);
    },
    get: (id) => API.request(`/api/tasks/${id}`),
    create: (payload) => API.request("/api/tasks", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    updateStatus: (id, status, progress_percent = null) => API.request(`/api/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, progress_percent })
    }),
    startDevelopment: (id) => API.request(`/api/tasks/${id}/start-development`, { method: "POST" }),
    updateProgress: (id, progress_percent) => API.request(`/api/tasks/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ progress_percent })
    }),
    submitForTesting: (id) => API.request(`/api/tasks/${id}/submit-for-testing`, { method: "POST" }),
    startTesting: (id) => API.request(`/api/tasks/${id}/start-testing`, { method: "POST" }),
    passTesting: (id) => API.request(`/api/tasks/${id}/pass-testing`, { method: "POST" }),
    failTesting: (id, payload) => API.request(`/api/tasks/${id}/fail-testing`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
    delete: (id) => API.request(`/api/tasks/${id}`, { method: "DELETE" }),
  },

  // Testing
  testing: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/testing/test-cases${q ? '?' + q : ''}`);
    },
    get: (id) => API.request(`/api/testing/test-cases/${id}`),
    create: (payload) => API.request("/api/testing/test-cases", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/testing/test-cases/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    execute: (id, payload) => API.request(`/api/testing/test-cases/${id}/execute`, { method: "POST", body: JSON.stringify(payload) }),
    stats: (projectId = null) => API.request(projectId ? `/api/testing/stats?project_id=${projectId}` : "/api/testing/stats"),
    delete: (id) => API.request(`/api/testing/test-cases/${id}`, { method: "DELETE" }),
  },

  // Bugs
  bugs: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/bugs${q ? '?' + q : ''}`);
    },
    get: (id) => API.request(`/api/bugs/${id}`),
    report: (payload) => API.request("/api/bugs", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/bugs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    startFix: (id) => API.request(`/api/bugs/${id}/start-fix`, { method: "POST" }),
    markFixed: (id, resolution_notes) => API.request(`/api/bugs/${id}/mark-fixed`, {
      method: "POST",
      body: JSON.stringify({ resolution_notes })
    }),
    fix: (id, resolution_notes) => API.request(`/api/bugs/${id}/mark-fixed`, {
      method: "POST",
      body: JSON.stringify({ resolution_notes })
    }),
    retest: (id, passed, retest_notes) => API.request(`/api/bugs/${id}/retest`, {
      method: "POST",
      body: JSON.stringify({ passed, retest_notes })
    }),
    delete: (id) => API.request(`/api/bugs/${id}`, { method: "DELETE" }),
  },

  // Deployments
  deployments: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/deployments${q ? '?' + q : ''}`);
    },
    create: (payload) => API.request("/api/deployments", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/deployments/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => API.request(`/api/deployments/${id}`, { method: "DELETE" }),
  },

  // Maintenance
  maintenance: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/maintenance${q ? '?' + q : ''}`);
    },
    create: (payload) => API.request("/api/maintenance", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => API.request(`/api/maintenance/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => API.request(`/api/maintenance/${id}`, { method: "DELETE" }),
  },

  // Reports
  reports: {
    pmDashboard: () => API.request("/api/reports/pm-dashboard"),
    devDashboard: () => API.request("/api/reports/dev-dashboard"),
    qaDashboard: () => API.request("/api/reports/qa-dashboard"),
    custom: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return API.request(`/api/reports/custom${q ? '?' + q : ''}`);
    },
  },

  // Notifications
  notifications: {
    list: () => API.request("/api/notifications"),
    unreadCount: () => API.request("/api/notifications/unread-count"),
    markRead: (id) => API.request(`/api/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => API.request("/api/notifications/read-all", { method: "POST" }),
  }
};
