// Main Application Controller & SPA Router

window.App = {
  currentUser: null,
  currentRoute: "dashboard",
  routeParams: {},

  init() {
    this.currentUser = API.getUser();
    const token = API.getToken();

    if (!token || !this.currentUser) {
      this.renderAuthView();
      return;
    }

    // Verify token validity
    API.auth.me()
      .then(res => {
        this.currentUser = res.user;
        API.setUser(res.user);
        this.handleHashChange();
      })
      .catch(() => {
        this.renderAuthView();
      });

    window.addEventListener("hashchange", () => this.handleHashChange());
  },

  handleLoginSuccess() {
    this.currentUser = API.getUser();
    window.location.hash = "#dashboard";
    this.navigate("dashboard");
  },

  renderAuthView() {
    const root = document.getElementById("app-root");
    AuthView.render(root);
  },

  handleHashChange() {
    const hash = window.location.hash.substring(1) || "dashboard";
    const [route, queryString] = hash.split("?");
    const params = {};

    if (queryString) {
      const sp = new URLSearchParams(queryString);
      for (const [k, v] of sp.entries()) {
        params[k] = v;
      }
    }

    this.navigate(route, params, false);
  },

  navigate(route, params = {}, updateHash = true) {
    if (!this.currentUser) {
      this.renderAuthView();
      return;
    }

    this.currentRoute = route;
    this.routeParams = params;

    if (updateHash) {
      const q = new URLSearchParams(params).toString();
      window.location.hash = `#${route}${q ? '?' + q : ''}`;
    }

    this.renderAppShell();
  },

  renderAppShell() {
    const root = document.getElementById("app-root");
    root.innerHTML = `
      <div class="app-container">
        <!-- Dynamic Role-Based Sidebar -->
        <div id="sidebar-mount"></div>

        <!-- Main Wrapper -->
        <div class="main-wrapper">
          <!-- Top Navigation Header -->
          <div id="header-mount"></div>

          <!-- Active Page Content Viewport -->
          <main class="content-area" id="page-content"></main>
        </div>
      </div>
    `;

    // 1. Render Sidebar
    const sidebarMount = document.getElementById("sidebar-mount");
    Sidebar.render(sidebarMount, this.currentUser, this.currentRoute);

    // 2. Render Top Header
    const headerMount = document.getElementById("header-mount");
    const pageTitle = this.getPageTitle(this.currentRoute);
    Header.render(headerMount, this.currentUser, pageTitle);

    // 3. Dispatch Content Area View
    const pageContent = document.getElementById("page-content");
    this.dispatchView(pageContent);
  },

  getPageTitle(route) {
    if (route === "dashboard") {
      if (this.currentUser.role === "Developer") return "Development Workspace";
      if (this.currentUser.role === "Tester") return "Testing Workspace";
      return "Project Manager Dashboard";
    }
    const map = {
      "projects": "Software Projects",
      "project-detail": "Project Details & Lifecycle",
      "requirements": "Requirements Backlog",
      "tasks": "Sprint Tasks & Kanban",
      "development": "Engineering Development",
      "testing": "Test Management",
      "test-cases": "QA Test Cases",
      "test-execution": "Test Execution",
      "bugs": "Defect Tracking",
      "deployment": "Release Deployments",
      "maintenance": "Maintenance & Enhancements",
      "reports": "Reports & Analytics",
      "notifications": "Notification Center",
      "settings": "Settings & Team",
      "team": "Enterprise Team",
      "sdlc-tracker": "SDLC Phase Progression",
    };
    return map[route] || "Workspace";
  },

  dispatchView(container) {
    const route = this.currentRoute;
    const role = this.currentUser.role;
    const params = this.routeParams;

    if (route === "dashboard") {
      if (role === "Project Manager") {
        PMDashboardView.render(container);
      } else if (role === "Developer") {
        DevDashboardView.render(container);
      } else {
        QADashboardView.render(container);
      }
    } else if (route === "projects" || route === "sdlc-tracker") {
      ProjectsView.render(container, params);
    } else if (route === "project-detail") {
      ProjectDetailView.render(container, params);
    } else if (route === "requirements") {
      RequirementsView.render(container, params);
    } else if (route === "tasks") {
      TasksView.render(container, params);
    } else if (route === "development") {
      DevDashboardView.render(container);
    } else if (route === "testing" || route === "test-cases" || route === "test-execution") {
      TestingView.render(container, params);
    } else if (route === "bugs") {
      BugsView.render(container, params);
    } else if (route === "deployment") {
      DeploymentView.render(container, params);
    } else if (route === "maintenance") {
      MaintenanceView.render(container, params);
    } else if (route === "reports") {
      ReportsView.render(container);
    } else if (route === "notifications") {
      NotificationsView.render(container);
    } else if (route === "settings" || route === "team") {
      SettingsView.render(container);
    } else {
      // Fallback to dashboard
      this.navigate("dashboard");
    }
  },

  handleGlobalSearch(query) {
    API.toast(`Searching across projects & deliverables for "${query}"...`, "info");
    // Navigate to tasks or projects with filter
    this.navigate("tasks");
    setTimeout(() => {
      const searchInput = document.getElementById("task-search-input");
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event("input"));
      }
    }, 150);
  }
};

// Boot Application
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
