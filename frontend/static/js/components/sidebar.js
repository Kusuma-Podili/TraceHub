// Role-Based Sidebar Navigation Component

const Sidebar = {
  getNavItems(role) {
    if (role === "Project Manager") {
      return [
        { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { id: "projects", label: "Projects", icon: "folder-kanban" },
        { id: "requirements", label: "Requirements", icon: "file-text" },
        { id: "tasks", label: "Tasks", icon: "check-square" },
        { id: "sdlc-tracker", label: "SDLC Tracker", icon: "git-merge" },
        { id: "testing", label: "Testing & QA", icon: "flask-conical" },
        { id: "bugs", label: "Bug Tracking", icon: "bug" },
        { id: "team", label: "Team", icon: "users" },
        { id: "reports", label: "Reports", icon: "bar-chart-3" },
        { id: "notifications", label: "Notifications", icon: "bell" },
        { id: "settings", label: "Settings", icon: "settings" },
      ];
    } else if (role === "Developer") {
      return [
        { id: "dashboard", label: "Development Workspace", icon: "code" },
        { id: "tasks", label: "My Tasks", icon: "check-square" },
        { id: "bugs", label: "Assigned Bugs", icon: "bug" },
        { id: "requirements", label: "Requirements", icon: "file-text" },
        { id: "notifications", label: "Notifications", icon: "bell" },
        { id: "settings", label: "Settings", icon: "settings" },
      ];
    } else { // Tester
      return [
        { id: "dashboard", label: "Testing Workspace", icon: "flask-conical" },
        { id: "test-cases", label: "Test Cases", icon: "list-checks" },
        { id: "test-execution", label: "Execute Tests", icon: "play-circle" },
        { id: "bugs", label: "Bug Tracker", icon: "bug" },
        { id: "requirements", label: "Requirements", icon: "file-text" },
        { id: "notifications", label: "Notifications", icon: "bell" },
        { id: "settings", label: "Settings", icon: "settings" },
      ];
    }
  },

  render(container, user, activeRoute = "dashboard") {
    const navItems = this.getNavItems(user.role);

    container.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-brand-badge">S</div>
          <div class="sidebar-brand-text">
            <span class="sidebar-brand-title">SDLC Enterprise</span>
            <span class="sidebar-brand-sub">Platform v1.0</span>
          </div>
        </div>

        <div class="sidebar-role-indicator">
          <span class="sidebar-role-label">Workspace Role</span>
          <span class="sidebar-role-name">${user.role}</span>
        </div>

        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <a class="nav-item ${activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
              <i data-lucide="${item.icon}"></i>
              <span>${item.label}</span>
              ${item.id === 'notifications' ? '<span id="sidebar-notif-badge" class="nav-badge" style="display:none;">0</span>' : ''}
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="user-snippet">
            <div class="user-avatar" style="background-color: ${user.avatar_color || '#1E3A2F'};">
              ${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="user-info">
              <span class="user-name">${user.full_name}</span>
              <span class="user-email">${user.email}</span>
            </div>
          </div>
          <button class="logout-btn" id="btn-logout" title="Sign Out">
            <i data-lucide="log-out"></i>
          </button>
        </div>
      </aside>
    `;

    // Bind nav item clicks
    container.querySelectorAll(".nav-item").forEach(el => {
      el.onclick = () => {
        const route = el.getAttribute("data-route");
        window.App.navigate(route);
      };
    });

    // Bind logout click
    const logoutBtn = container.querySelector("#btn-logout");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        API.clearToken();
        API.toast("Signed out successfully.", "info");
        window.App.renderAuthView();
      };
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
