// Project Manager Dashboard View

const PMDashboardView = {
  charts: {},

  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Project Governance</h1>
          <p class="page-subtitle">Cross-project SDLC lifecycle monitoring, automated quality gates, and deliverable metrics</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-dashboard">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-new-project-pm">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> New Project
          </button>
        </div>
      </div>

      <!-- 11 KPI Metrics Grid -->
      <div class="metrics-grid" id="pm-kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <span class="metric-label">Total Projects</span>
          <span class="metric-value" id="kpi-total-projects">-</span>
          <span class="metric-sub" id="kpi-sub-projects">Portfolio overview</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Active Projects</span>
          <span class="metric-value" id="kpi-active-projects" style="color: var(--brand-forest);">-</span>
          <span class="metric-sub">In SDLC pipeline</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Completed Projects</span>
          <span class="metric-value" id="kpi-completed-projects" style="color: #10B981;">-</span>
          <span class="metric-sub">Released & live</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Requirements</span>
          <span class="metric-value" id="kpi-requirements">-</span>
          <span class="metric-sub" id="kpi-req-sub">Approved / Total</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Total Dev Tasks</span>
          <span class="metric-value" id="kpi-total-tasks">-</span>
          <span class="metric-sub">All sprint items</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Completed Tasks</span>
          <span class="metric-value" id="kpi-completed-tasks" style="color: #10B981;">-</span>
          <span class="metric-sub" id="kpi-completed-tasks-sub">QA Verified</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Ready for Testing</span>
          <span class="metric-value" id="kpi-ready-testing" style="color: #8B5CF6;">-</span>
          <span class="metric-sub">Awaiting QA intake</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">In Testing</span>
          <span class="metric-value" id="kpi-in-testing" style="color: #3B82F6;">-</span>
          <span class="metric-sub">Active QA validation</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Open Bugs</span>
          <span class="metric-value" id="kpi-open-bugs" style="color: #E11D48;">-</span>
          <span class="metric-sub" id="kpi-critical-bugs">Critical / High</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Ready for Retest</span>
          <span class="metric-value" id="kpi-ready-retest" style="color: #D97706;">-</span>
          <span class="metric-sub" id="kpi-closed-bugs">Patched by devs</span>
        </div>
        <div class="metric-card" style="background: linear-gradient(135deg, var(--bg-card) 0%, rgba(30,58,47,0.06) 100%); border-color: var(--brand-forest-light);">
          <span class="metric-label">Overall Progress</span>
          <span class="metric-value" id="kpi-overall-completion" style="color: var(--brand-forest); font-weight: 800;">-%</span>
          <span class="metric-sub" id="kpi-test-rate">Weighted lifecycle</span>
        </div>
      </div>

      <!-- Project SDLC Breakdown Matrix Table -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Project SDLC Deliverables Breakdown</h3>
            <span style="font-size: 12px; color: var(--text-muted);">Real-time deliverable matrix across Requirements, Development, Testing, and Quality</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="pm-filter-breakdown" class="form-control" placeholder="Search project matrix..." style="width: 220px; padding: 6px 10px; font-size: 12.5px;" />
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table" id="pm-breakdown-table">
            <thead>
              <tr>
                <th>Project Name & Code</th>
                <th>Current SDLC Phase</th>
                <th>Requirements (Approved)</th>
                <th>Development Tasks</th>
                <th>Testing (Passed)</th>
                <th>Defects (Open / Total)</th>
                <th>Overall Progress</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="pm-breakdown-tbody">
              <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading project SDLC breakdown matrix...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interactive Visual Analytics Charts -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; margin-bottom: 28px;">
        <!-- Chart 1: SDLC Phase Distribution -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <h3 class="card-title">SDLC Phase Distribution</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);">Current project positions</span>
          </div>
          <div class="card-body" style="height: 260px; display: flex; align-items: center; justify-content: center;">
            <canvas id="chart-phase-dist"></canvas>
          </div>
        </div>

        <!-- Chart 2: Task Status Distribution -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <h3 class="card-title">Task Pipeline Breakdown</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);">Kanban flow status</span>
          </div>
          <div class="card-body" style="height: 260px; display: flex; align-items: center; justify-content: center;">
            <canvas id="chart-task-status"></canvas>
          </div>
        </div>

        <!-- Chart 3: Bug Severity Distribution -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <h3 class="card-title">Bug Severity & Quality Risk</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);">Defect triage</span>
          </div>
          <div class="card-body" style="height: 260px; display: flex; align-items: center; justify-content: center;">
            <canvas id="chart-bug-severity"></canvas>
          </div>
        </div>

        <!-- Chart 4: Testing Execution Results -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <h3 class="card-title">QA Verification Outcomes</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);">Test case execution</span>
          </div>
          <div class="card-body" style="height: 260px; display: flex; align-items: center; justify-content: center;">
            <canvas id="chart-testing-results"></canvas>
          </div>
        </div>
      </div>

      <!-- New Project Modal -->
      <div id="modal-new-project" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Initialize New Software Project</h3>
            <button class="modal-close" id="btn-close-new-project">&times;</button>
          </div>
          <form id="form-create-project">
            <div class="modal-body">
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Project Name</label>
                  <input type="text" id="new-proj-name" class="form-control" placeholder="e.g. Apex Cloud Gaming Engine" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Project Code</label>
                  <input type="text" id="new-proj-code" class="form-control" placeholder="e.g. APEX-01" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Project Scope & Description</label>
                <textarea id="new-proj-desc" class="form-control" placeholder="Describe the objectives, architecture, and deliverables..."></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="new-proj-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Target Completion Date</label>
                  <input type="date" id="new-proj-target" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Assign Team Members</label>
                <select id="new-proj-members" class="form-control" multiple style="height: 90px;">
                  <!-- Populated dynamically -->
                </select>
                <span style="font-size: 11px; color: var(--text-muted);">Hold Ctrl / Cmd to select multiple team members.</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-new-project">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Project</button>
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
    const refreshBtn = document.getElementById("btn-refresh-dashboard");
    if (refreshBtn) {
      refreshBtn.onclick = () => this.loadData();
    }

    // Modal triggers
    const modal = document.getElementById("modal-new-project");
    const openBtn = document.getElementById("btn-new-project-pm");
    const closeBtn = document.getElementById("btn-close-new-project");
    const cancelBtn = document.getElementById("btn-cancel-new-project");
    const form = document.getElementById("form-create-project");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        modal.classList.add("active");
        try {
          const users = await API.auth.getUsers();
          const select = document.getElementById("new-proj-members");
          select.innerHTML = users.map(u => `
            <option value="${u.id}">${u.full_name} (${u.role})</option>
          `).join('');
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
        const name = document.getElementById("new-proj-name").value.trim();
        const code = document.getElementById("new-proj-code").value.trim().toUpperCase();
        const description = document.getElementById("new-proj-desc").value.trim();
        const priority = document.getElementById("new-proj-priority").value;
        const target_date_raw = document.getElementById("new-proj-target").value;
        const target_date = target_date_raw ? new Date(target_date_raw).toISOString() : null;

        const membersSelect = document.getElementById("new-proj-members");
        const member_ids = Array.from(membersSelect.selectedOptions).map(o => parseInt(o.value));

        try {
          const res = await API.projects.create({
            name, code, description, priority, target_date, member_ids
          });
          API.toast(`Project '${res.name}' created successfully!`, "success");
          modal.classList.remove("active");
          form.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Filter Breakdown Matrix
    const filterInput = document.getElementById("pm-filter-breakdown");
    if (filterInput) {
      filterInput.oninput = () => {
        const q = filterInput.value.toLowerCase();
        const rows = document.querySelectorAll("#pm-breakdown-tbody tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? "" : "none";
        });
      };
    }
  },

  async loadData() {
    try {
      const data = await API.reports.pmDashboard();

      // Update 11 KPI Cards
      document.getElementById("kpi-total-projects").textContent = data.total_projects;
      document.getElementById("kpi-sub-projects").textContent = `${data.on_hold_projects || 0} on hold`;
      document.getElementById("kpi-active-projects").textContent = data.active_projects;
      document.getElementById("kpi-completed-projects").textContent = data.completed_projects;

      document.getElementById("kpi-requirements").textContent = `${data.approved_requirements} / ${data.total_requirements}`;
      document.getElementById("kpi-req-sub").textContent = `${data.open_requirements} pending approval`;

      document.getElementById("kpi-total-tasks").textContent = data.total_tasks;
      document.getElementById("kpi-completed-tasks").textContent = data.completed_tasks;
      document.getElementById("kpi-completed-tasks-sub").textContent = `${data.pending_tasks} in progress`;

      document.getElementById("kpi-ready-testing").textContent = data.ready_for_testing_tasks;
      document.getElementById("kpi-in-testing").textContent = data.testing_tasks;

      document.getElementById("kpi-open-bugs").textContent = data.open_bugs;
      document.getElementById("kpi-critical-bugs").textContent = `${data.critical_high_bugs} Critical / High`;

      document.getElementById("kpi-ready-retest").textContent = data.ready_retest_bugs;
      document.getElementById("kpi-closed-bugs").textContent = `${data.closed_bugs} closed`;

      document.getElementById("kpi-overall-completion").textContent = `${data.overall_completion}%`;
      document.getElementById("kpi-test-rate").textContent = `${data.testing_progress}% Test Pass Rate`;

      // Render Charts
      this.renderCharts(data);

      // Render Project Breakdown Matrix
      this.renderBreakdownTable(data.projects_breakdown || []);
    } catch (err) {
      API.toast("Failed to load dashboard metrics: " + err.message, "error");
    }
  },

  renderBreakdownTable(projects) {
    const tbody = document.getElementById("pm-breakdown-tbody");
    if (!tbody) return;

    if (!projects || projects.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
            No projects registered yet. Click "New Project" to initialize one.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = projects.map(p => {
      const reqPct = p.req_pct || 0;
      const devPct = p.dev_pct || 0;
      const testPct = p.test_pct || 0;
      const overall = p.overall_progress || 0;

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 14px;">${p.name}</div>
            <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono);">${p.code}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: var(--brand-forest); font-size: 12.5px; display: inline-flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--brand-forest);"></span>
              ${p.current_phase}
            </span>
          </td>
          <td style="min-width: 140px;">
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>${p.req_approved} / ${p.req_count}</span>
              <span style="color: var(--text-muted);">${reqPct}%</span>
            </div>
            <div class="progress-container" style="height: 6px;">
              <div class="progress-fill" style="width: ${reqPct}%; background: #3B82F6;"></div>
            </div>
          </td>
          <td style="min-width: 140px;">
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>${p.task_completed} / ${p.task_count}</span>
              <span style="color: var(--text-muted);">${devPct}%</span>
            </div>
            <div class="progress-container" style="height: 6px;">
              <div class="progress-fill" style="width: ${devPct}%; background: #10B981;"></div>
            </div>
          </td>
          <td style="min-width: 140px;">
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>${p.test_passed} / ${p.test_count}</span>
              <span style="color: var(--text-muted);">${testPct}%</span>
            </div>
            <div class="progress-container" style="height: 6px;">
              <div class="progress-fill" style="width: ${testPct}%; background: #8B5CF6;"></div>
            </div>
          </td>
          <td>
            <span class="badge ${p.bug_open > 0 ? 'badge-critical' : 'badge-low'}">
              ${p.bug_open} Open / ${p.bug_count} Total
            </span>
          </td>
          <td style="min-width: 130px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--brand-forest); margin-bottom: 4px;">
              ${overall}%
            </div>
            <div class="progress-container" style="height: 8px;">
              <div class="progress-fill" style="width: ${overall}%;"></div>
            </div>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('project-detail', { id: ${p.id} })">
              Manage
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderCharts(data) {
    // Chart 1: SDLC Phase Distribution
    const ctxPhase = document.getElementById("chart-phase-dist");
    if (ctxPhase) {
      if (this.charts.phase) this.charts.phase.destroy();
      const labels = Object.keys(data.phase_distribution || {});
      const values = Object.values(data.phase_distribution || {});
      this.charts.phase = new Chart(ctxPhase, {
        type: "doughnut",
        data: {
          labels: labels.length ? labels : ["No Projects"],
          datasets: [{
            data: values.length ? values : [1],
            backgroundColor: ["#1E3A2F", "#2D5A43", "#3C6E71", "#526058", "#D97706", "#2563EB", "#059669"],
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // Chart 2: Task Status Distribution
    const ctxTask = document.getElementById("chart-task-status");
    if (ctxTask) {
      if (this.charts.task) this.charts.task.destroy();
      const labels = Object.keys(data.task_status_distribution || {});
      const values = Object.values(data.task_status_distribution || {});
      this.charts.task = new Chart(ctxTask, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Tasks",
            data: values,
            backgroundColor: ["#94A3B8", "#F59E0B", "#8B5CF6", "#10B981"],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
          plugins: { legend: { display: false } }
        }
      });
    }

    // Chart 3: Bug Severity Distribution
    const ctxBug = document.getElementById("chart-bug-severity");
    if (ctxBug) {
      if (this.charts.bug) this.charts.bug.destroy();
      const labels = Object.keys(data.bug_severity_distribution || {});
      const values = Object.values(data.bug_severity_distribution || {});
      this.charts.bug = new Chart(ctxBug, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Defects",
            data: values,
            backgroundColor: ["#0D9488", "#D97706", "#E11D48", "#991B1B"],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
          plugins: { legend: { display: false } }
        }
      });
    }

    // Chart 4: Testing Results
    const ctxTest = document.getElementById("chart-testing-results");
    if (ctxTest) {
      if (this.charts.test) this.charts.test.destroy();
      const labels = Object.keys(data.testing_results_distribution || {});
      const values = Object.values(data.testing_results_distribution || {});
      this.charts.test = new Chart(ctxTest, {
        type: "doughnut",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: ["#10B981", "#EF4444", "#F59E0B", "#9CA3AF"],
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }
};
