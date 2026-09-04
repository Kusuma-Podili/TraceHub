// Requirements Management View

const RequirementsView = {
  requirements: [],

  async render(container, params = {}) {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Requirements Engineering & Backlog</h1>
          <p class="page-subtitle">Define business specifications, user stories, acceptance criteria, and traceability</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-reqs">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          ${isPM ? `
            <button class="btn btn-primary" id="btn-create-req">
              <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Add Requirement
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="req-search-input" class="form-control" placeholder="Search requirements by code, title, description..." />
          </div>
          <div style="width: 200px;">
            <select id="req-filter-project" class="form-control">
              <option value="">All Projects</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="req-filter-priority" class="form-control">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style="width: 160px;">
            <select id="req-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="Proposed">Proposed</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Requirements Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Req Code & Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Created</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="reqs-table-body">
              <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading requirements...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Requirement Modal -->
      <div id="modal-req" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-req-title">New Software Requirement</h3>
            <button class="modal-close" id="btn-close-req-modal">&times;</button>
          </div>
          <form id="form-req">
            <input type="hidden" id="req-edit-id" />
            <div class="modal-body">
              <div class="form-group" id="group-req-project">
                <label class="form-label">Project</label>
                <select id="req-form-project" class="form-control" required>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Requirement Title</label>
                <input type="text" id="req-form-title" class="form-control" placeholder="e.g. Vulkan Multi-threaded Command Buffer Submission" required />
              </div>
              <div class="form-group">
                <label class="form-label">Detailed Specification / User Story</label>
                <textarea id="req-form-desc" class="form-control" placeholder="As a system, it must maintain 120 FPS under asynchronous compute load..."></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="req-form-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select id="req-form-status" class="form-control">
                    <option value="Proposed">Proposed</option>
                    <option value="Approved" selected>Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Assign To Team Member</label>
                <select id="req-form-assigned" class="form-control">
                  <option value="">-- Unassigned --</option>
                  <!-- Populated dynamically -->
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-req-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-req">Save Requirement</button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindEvents();
    await this.loadProjectsFilter(params.project_id);
    await this.loadData(params.project_id);
  },

  bindEvents() {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    const refreshBtn = document.getElementById("btn-refresh-reqs");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Modal triggers
    const modal = document.getElementById("modal-req");
    const openBtn = document.getElementById("btn-create-req");
    const closeBtn = document.getElementById("btn-close-req-modal");
    const cancelBtn = document.getElementById("btn-cancel-req-modal");
    const form = document.getElementById("form-req");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        document.getElementById("modal-req-title").textContent = "New Software Requirement";
        document.getElementById("req-edit-id").value = "";
        form.reset();
        document.getElementById("group-req-project").style.display = "block";
        modal.classList.add("active");
        await this.populateFormSelects();
      };

      closeBtn.onclick = () => modal.classList.remove("active");
      cancelBtn.onclick = () => modal.classList.remove("active");
    }

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const editId = document.getElementById("req-edit-id").value;
        const title = document.getElementById("req-form-title").value.trim();
        const description = document.getElementById("req-form-desc").value.trim();
        const priority = document.getElementById("req-form-priority").value;
        const status = document.getElementById("req-form-status").value;
        const assignedVal = document.getElementById("req-form-assigned").value;
        const assigned_to_id = assignedVal ? parseInt(assignedVal) : null;

        try {
          if (editId) {
            await API.requirements.update(editId, { title, description, priority, status, assigned_to_id });
            API.toast("Requirement updated successfully!", "success");
          } else {
            const project_id = parseInt(document.getElementById("req-form-project").value);
            await API.requirements.create({ project_id, title, description, priority, status, assigned_to_id });
            API.toast("Requirement created successfully!", "success");
          }
          modal.classList.remove("active");
          form.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Filter controls
    const searchInput = document.getElementById("req-search-input");
    const filterProj = document.getElementById("req-filter-project");
    const filterPri = document.getElementById("req-filter-priority");
    const filterSt = document.getElementById("req-filter-status");

    const applyFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const projId = filterProj.value;
      const pri = filterPri.value;
      const st = filterSt.value;

      const filtered = this.requirements.filter(r => {
        const matchesQ = !q || r.req_code.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q));
        const matchesProj = !projId || r.project_id == projId;
        const matchesPri = !pri || r.priority === pri;
        const matchesSt = !st || r.status === st;
        return matchesQ && matchesProj && matchesPri && matchesSt;
      });

      this.renderTable(filtered);
    };

    if (searchInput) searchInput.oninput = applyFilter;
    if (filterProj) filterProj.onchange = applyFilter;
    if (filterPri) filterPri.onchange = applyFilter;
    if (filterSt) filterSt.onchange = applyFilter;
  },

  async loadProjectsFilter(selectedProjId) {
    try {
      const projects = await API.projects.list();
      const select = document.getElementById("req-filter-project");
      if (select) {
        select.innerHTML = `<option value="">All Projects</option>` + projects.map(p => `
          <option value="${p.id}" ${selectedProjId && selectedProjId == p.id ? 'selected' : ''}>${p.name} (${p.code})</option>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  },

  async populateFormSelects() {
    try {
      const projects = await API.projects.list();
      const projSelect = document.getElementById("req-form-project");
      projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

      const users = await API.auth.getUsers();
      const userSelect = document.getElementById("req-form-assigned");
      userSelect.innerHTML = `<option value="">-- Unassigned --</option>` + users.map(u => `<option value="${u.id}">${u.full_name} (${u.role})</option>`).join('');
    } catch (err) {
      console.error(err);
    }
  },

  async loadData(projectId = null) {
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      this.requirements = await API.requirements.list(params);
      this.renderTable(this.requirements);
    } catch (err) {
      API.toast("Failed to load requirements: " + err.message, "error");
    }
  },

  renderTable(reqs) {
    const tbody = document.getElementById("reqs-table-body");
    if (!tbody) return;

    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    if (!reqs || reqs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No requirements found.</td></tr>`;
      return;
    }

    tbody.innerHTML = reqs.map(r => {
      const statusKey = r.status.toLowerCase().replace(' ', '-');
      const isAssignedToMe = user.id === r.assigned_to_id;
      return `
        <tr style="${isAssignedToMe ? 'background-color: var(--bg-card-hover);' : ''}">
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">
              ${r.title}
              ${isAssignedToMe ? '<span class="badge" style="background:#E0E7FF; color:#4338CA; margin-left:6px;">Assigned to You</span>' : ''}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${r.req_code}</div>
          </td>
          <td style="color: var(--text-secondary); font-size: 13px;">${r.project_name}</td>
          <td>
            <div style="font-size: 13px; font-weight: 500;">${r.assigned_to_name}</div>
          </td>
          <td><span class="badge badge-${r.priority.toLowerCase()}">${r.priority}</span></td>
          <td><span class="badge badge-${statusKey}">${r.status}</span></td>
          <td><span style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">${r.tasks_count} tasks</span></td>
          <td style="font-size: 12px; color: var(--text-muted);">${r.created_at ? r.created_at.split('T')[0] : ''}</td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="RequirementsView.openEditModal(${r.id})">
                ${isPM ? 'Edit' : 'View'}
              </button>
              ${isPM ? `
                <button class="btn btn-secondary btn-sm" style="color:#DC2626;" onclick="RequirementsView.deleteReq(${r.id})">
                  Delete
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  async openEditModal(reqId) {
    const modal = document.getElementById("modal-req");
    const r = this.requirements.find(item => item.id === reqId);
    if (!r) return;

    await this.populateFormSelects();

    document.getElementById("modal-req-title").textContent = `Edit Requirement (${r.req_code})`;
    document.getElementById("req-edit-id").value = r.id;
    document.getElementById("group-req-project").style.display = "none";
    document.getElementById("req-form-title").value = r.title;
    document.getElementById("req-form-desc").value = r.description || '';
    document.getElementById("req-form-priority").value = r.priority;
    document.getElementById("req-form-status").value = r.status;
    document.getElementById("req-form-assigned").value = r.assigned_to_id || '';

    modal.classList.add("active");
  },

  async deleteReq(reqId) {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    try {
      await API.requirements.delete(reqId);
      API.toast("Requirement deleted successfully.", "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  }
};
