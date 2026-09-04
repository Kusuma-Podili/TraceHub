// Maintenance Module View

const MaintenanceView = {
  records: [],

  async render(container, params = {}) {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Post-Deployment Maintenance & Enhancements</h1>
          <p class="page-subtitle">Track operational service requests, production hotfix issues, SLA tickets, and user enhancements</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-maint">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-create-maint">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Log Maintenance Ticket
          </button>
        </div>
      </div>

      <!-- Maintenance Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket Title</th>
                <th>Project</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Owner</th>
                <th>Resolution Details</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="maint-table-body">
              <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading maintenance records...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log Maintenance Modal -->
      <div id="modal-maint" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Log Maintenance / Enhancement Request</h3>
            <button class="modal-close" id="btn-close-maint-modal">&times;</button>
          </div>
          <form id="form-maint">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Project</label>
                <select id="maint-form-project" class="form-control" required>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Title / Summary</label>
                <input type="text" id="maint-form-title" class="form-control" placeholder="e.g. Add DLSS 3.5 frame generation support" required />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Ticket Type</label>
                  <select id="maint-form-type" class="form-control">
                    <option value="Issue">Issue (Bug hotfix)</option>
                    <option value="Enhancement" selected>Enhancement (New feature)</option>
                    <option value="Request">Request (Configuration)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="maint-form-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Assign To</label>
                <select id="maint-form-assigned" class="form-control">
                  <option value="">-- Unassigned --</option>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Resolution Details / Notes</label>
                <textarea id="maint-form-resolution" class="form-control" placeholder="Describe root cause, planned enhancement scope, or operational steps..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-maint-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Ticket</button>
            </div>
          </form>
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
    const refreshBtn = document.getElementById("btn-refresh-maint");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Modal
    const modal = document.getElementById("modal-maint");
    const openBtn = document.getElementById("btn-create-maint");
    const closeBtn = document.getElementById("btn-close-maint-modal");
    const cancelBtn = document.getElementById("btn-cancel-maint-modal");
    const form = document.getElementById("form-maint");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        form.reset();
        modal.classList.add("active");
        try {
          const projects = await API.projects.list();
          const projSelect = document.getElementById("maint-form-project");
          projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

          const users = await API.auth.getUsers();
          const userSelect = document.getElementById("maint-form-assigned");
          userSelect.innerHTML = `<option value="">-- Unassigned --</option>` + users.map(u => `<option value="${u.id}">${u.full_name} (${u.role})</option>`).join('');
        } catch (err) {
          console.error(err);
        }
      };

      closeBtn.onclick = () => modal.classList.remove("active");
      cancelBtn.onclick = () => modal.classList.remove("active");
    }

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const project_id = parseInt(document.getElementById("maint-form-project").value);
        const title = document.getElementById("maint-form-title").value.trim();
        const type = document.getElementById("maint-form-type").value;
        const priority = document.getElementById("maint-form-priority").value;
        const assignedVal = document.getElementById("maint-form-assigned").value;
        const assigned_to_id = assignedVal ? parseInt(assignedVal) : null;
        const resolution_details = document.getElementById("maint-form-resolution").value.trim();

        try {
          await API.maintenance.create({ project_id, title, type, priority, assigned_to_id, resolution_details });
          API.toast(`Maintenance ticket '${title}' logged!`, "success");
          modal.classList.remove("active");
          form.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }
  },

  async loadData() {
    try {
      this.records = await API.maintenance.list();
      this.renderTable(this.records);
    } catch (err) {
      API.toast("Failed to load maintenance records: " + err.message, "error");
    }
  },

  renderTable(records) {
    const tbody = document.getElementById("maint-table-body");
    if (!tbody) return;

    if (!records || records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No maintenance tickets logged yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = records.map(r => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${r.title}</div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${r.project_name}</td>
        <td>
          <span class="badge" style="background: var(--bg-secondary); color: var(--brand-forest); font-weight: 600;">
            ${r.type}
          </span>
        </td>
        <td><span class="badge badge-${r.priority.toLowerCase()}">${r.priority}</span></td>
        <td>
          <span class="badge" style="${r.status === 'Resolved' || r.status === 'Closed' ? 'background:#D1FAE5; color:#065F46;' : 'background:#FEF3C7; color:#92400E;'}">
            ${r.status}
          </span>
        </td>
        <td style="font-size: 13px;">${r.assigned_to_name || 'Unassigned'}</td>
        <td style="font-size: 12.5px; color: var(--text-secondary); max-width: 260px;">
          ${r.resolution_details || 'Pending resolution'}
        </td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceView.updateStatus(${r.id})">
            Update
          </button>
        </td>
      </tr>
    `).join('');
  },

  async updateStatus(recId) {
    const newStatus = prompt("Enter status (Open, In Analysis, In Progress, Resolved, Closed):");
    if (!newStatus) return;

    const resolution_details = prompt("Enter resolution notes / update:");
    try {
      await API.maintenance.update(recId, { status: newStatus, resolution_details: resolution_details || undefined });
      API.toast("Maintenance ticket updated!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  }
};
