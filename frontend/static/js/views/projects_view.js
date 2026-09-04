// Projects List View

const ProjectsView = {
  projects: [],

  async render(container) {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">${isPM ? 'Software Projects Portfolio' : 'My Assigned Projects'}</h1>
          <p class="page-subtitle">Track end-to-end SDLC phases, milestone timelines, and delivery health</p>
        </div>
        ${isPM ? `
          <button class="btn btn-primary" id="btn-create-proj-page">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Create Project
          </button>
        ` : ''}
      </div>

      <!-- Filters & Search Bar -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="proj-search-input" class="form-control" placeholder="Search by name, key, description..." />
          </div>
          <div style="width: 160px;">
            <select id="proj-filter-priority" class="form-control">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style="width: 160px;">
            <select id="proj-filter-phase" class="form-control">
              <option value="">All SDLC Phases</option>
              <option value="Requirement Analysis">Requirement Analysis</option>
              <option value="Planning">Planning</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Deployment">Deployment</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="proj-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Projects Grid / Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Project Name & Code</th>
                <th>Project Manager</th>
                <th>Current SDLC Phase</th>
                <th>Start Date</th>
                <th>Expected Completion</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress %</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="projects-table-body">
              <tr>
                <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading projects...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindEvents();
    await this.loadData();
  },

  bindEvents() {
    const createBtn = document.getElementById("btn-create-proj-page");
    if (createBtn) {
      createBtn.onclick = () => {
        // Open PM modal or navigate
        const pmModal = document.getElementById("modal-new-project");
        if (pmModal) {
          pmModal.classList.add("active");
        } else {
          window.App.navigate("dashboard");
        }
      };
    }

    const searchInput = document.getElementById("proj-search-input");
    const filterPriority = document.getElementById("proj-filter-priority");
    const filterPhase = document.getElementById("proj-filter-phase");
    const filterStatus = document.getElementById("proj-filter-status");

    const applyFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const pri = filterPriority.value;
      const ph = filterPhase.value;
      const st = filterStatus.value;

      const filtered = this.projects.filter(p => {
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
        const matchesPri = !pri || p.priority === pri;
        const matchesPhase = !ph || p.current_phase === ph;
        const matchesStatus = !st || p.status === st;
        return matchesQuery && matchesPri && matchesPhase && matchesStatus;
      });

      this.renderTable(filtered);
    };

    if (searchInput) searchInput.oninput = applyFilter;
    if (filterPriority) filterPriority.onchange = applyFilter;
    if (filterPhase) filterPhase.onchange = applyFilter;
    if (filterStatus) filterStatus.onchange = applyFilter;
  },

  async loadData() {
    try {
      this.projects = await API.projects.list();
      this.renderTable(this.projects);
    } catch (err) {
      API.toast("Failed to load projects: " + err.message, "error");
    }
  },

  renderTable(projects) {
    const tbody = document.getElementById("projects-table-body");
    if (!tbody) return;

    if (!projects || projects.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">
            No projects match the selected criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = projects.map(p => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 14px;">${p.name}</div>
          <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono);">${p.code}</div>
        </td>
        <td style="color: var(--text-secondary);">${p.manager_name}</td>
        <td>
          <span style="font-weight: 600; color: var(--brand-forest); font-size: 12.5px;">
            ${p.current_phase}
          </span>
        </td>
        <td style="font-size: 12px; color: var(--text-muted);">
          ${p.start_date ? p.start_date.split('T')[0] : 'N/A'}
        </td>
        <td style="font-size: 12px; color: var(--text-muted);">
          ${p.target_date ? p.target_date.split('T')[0] : 'TBD'}
        </td>
        <td><span class="badge badge-${p.priority.toLowerCase()}">${p.priority}</span></td>
        <td>
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${p.status === 'Active' ? '#10B981' : (p.status === 'Completed' ? '#3B82F6' : '#9CA3AF')}; margin-right: 6px;"></span>
          <span style="font-size: 12.5px; font-weight: 500;">${p.status}</span>
        </td>
        <td style="width: 140px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="progress-container">
              <div class="progress-fill" style="width: ${p.progress_percent}%;"></div>
            </div>
            <span style="font-size: 11.5px; font-weight: 600; width: 35px;">${p.progress_percent}%</span>
          </div>
        </td>
        <td style="text-align: right;">
          <button class="btn btn-primary btn-sm" onclick="window.App.navigate('project-detail', { id: ${p.id} })">
            Open Details
          </button>
        </td>
      </tr>
    `).join('');
  }
};
