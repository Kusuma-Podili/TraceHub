// Deployment Tracking Module View

const DeploymentView = {
  deployments: [],

  async render(container, params = {}) {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Release & Environment Deployments</h1>
          <p class="page-subtitle">Track build versions across Development, QA Testing, Staging, and Production rollouts</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-deps">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          ${isPM ? `
            <button class="btn btn-primary" id="btn-create-dep">
              <i data-lucide="rocket" style="width: 16px; height: 16px;"></i> Record Deployment
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Deployments Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Release Version</th>
                <th>Project</th>
                <th>Target Environment</th>
                <th>Status</th>
                <th>Release Notes</th>
                <th>Deployed By</th>
                <th>Deployment Date</th>
                ${isPM ? '<th style="text-align: right;">Action</th>' : ''}
              </tr>
            </thead>
            <tbody id="dep-table-body">
              <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading deployment records...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Record Deployment Modal -->
      <div id="modal-dep" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Record Environment Deployment</h3>
            <button class="modal-close" id="btn-close-dep-modal">&times;</button>
          </div>
          <form id="form-dep">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Project</label>
                <select id="dep-form-project" class="form-control" required>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Release Version Tag</label>
                  <input type="text" id="dep-form-version" class="form-control" placeholder="e.g. v1.2.0-rc3" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Target Environment</label>
                  <select id="dep-form-env" class="form-control">
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Staging" selected>Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Deployment Status</label>
                <select id="dep-form-status" class="form-control">
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Successful" selected>Successful</option>
                  <option value="Failed">Failed</option>
                  <option value="Rolled Back">Rolled Back</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Release Notes & Changelog</label>
                <textarea id="dep-form-notes" class="form-control" placeholder="Key feature deliverables, bug fixes included in this build..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-dep-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Deployment Record</button>
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
    const refreshBtn = document.getElementById("btn-refresh-deps");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Modal
    const modal = document.getElementById("modal-dep");
    const openBtn = document.getElementById("btn-create-dep");
    const closeBtn = document.getElementById("btn-close-dep-modal");
    const cancelBtn = document.getElementById("btn-cancel-dep-modal");
    const form = document.getElementById("form-dep");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        form.reset();
        modal.classList.add("active");
        try {
          const projects = await API.projects.list();
          const select = document.getElementById("dep-form-project");
          select.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');
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
        const project_id = parseInt(document.getElementById("dep-form-project").value);
        const version = document.getElementById("dep-form-version").value.trim();
        const environment = document.getElementById("dep-form-env").value;
        const status = document.getElementById("dep-form-status").value;
        const release_notes = document.getElementById("dep-form-notes").value.trim();

        try {
          await API.deployments.create({ project_id, version, environment, status, release_notes });
          API.toast(`Deployment ${version} to ${environment} recorded!`, "success");
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
      this.deployments = await API.deployments.list();
      this.renderTable(this.deployments);
    } catch (err) {
      API.toast("Failed to load deployments: " + err.message, "error");
    }
  },

  renderTable(deps) {
    const tbody = document.getElementById("dep-table-body");
    if (!tbody) return;

    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    if (!deps || deps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No deployments recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = deps.map(d => {
      const isSuccess = d.status === "Successful";
      const isFailed = d.status === "Failed" || d.status === "Rolled Back";
      const badgeStyle = isSuccess ? 'background:#D1FAE5; color:#065F46;' : (isFailed ? 'background:#FEE2E2; color:#991B1B;' : 'background:#FEF3C7; color:#92400E;');

      return `
        <tr>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono); color: var(--brand-forest); font-size: 13.5px;">${d.version}</div>
          </td>
          <td style="color: var(--text-secondary); font-size: 13px;">${d.project_name}</td>
          <td>
            <span class="badge" style="background: var(--bg-secondary); color: var(--brand-charcoal); font-weight: 600;">
              ${d.environment}
            </span>
          </td>
          <td><span class="badge" style="${badgeStyle}">${d.status}</span></td>
          <td style="font-size: 12.5px; color: var(--text-secondary); max-width: 260px;">
            ${d.release_notes || 'No notes provided'}
          </td>
          <td style="font-size: 12px;">${d.deployed_by_name}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${d.deployment_date ? d.deployment_date.split('T')[0] : ''}</td>
          ${isPM ? `
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="DeploymentView.quickUpdateStatus(${d.id})">
                Update
              </button>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  },

  async quickUpdateStatus(depId) {
    const newStatus = prompt("Enter new status (Planned, In Progress, Successful, Failed, Rolled Back):");
    if (!newStatus) return;

    try {
      await API.deployments.update(depId, { status: newStatus });
      API.toast(`Deployment status updated to ${newStatus}!`, "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  }
};
