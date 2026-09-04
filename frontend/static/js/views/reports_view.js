// Project Reports & Analytics View

const ReportsView = {
  currentReportType: "progress",

  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Reports & Quality Telemetry</h1>
          <p class="page-subtitle">Exportable cross-cutting reports for compliance audits, sprint retrospectives, and velocity</p>
        </div>
        <button class="btn btn-secondary" onclick="window.print()">
          <i data-lucide="printer" style="width: 15px; height: 15px;"></i> Print / Export PDF
        </button>
      </div>

      <!-- Report Type Selector Tabs -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm ${this.currentReportType === 'progress' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="progress">
            Project Progress Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'requirements' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="requirements">
            Requirement Traceability Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'tasks' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="tasks">
            Task Execution Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'testing' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="testing">
            QA Testing Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'bugs' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="bugs">
            Defect / Bug Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'deployments' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="deployments">
            Deployment Report
          </button>
          <button class="btn btn-sm ${this.currentReportType === 'phases' ? 'btn-primary' : 'btn-secondary'} rpt-tab" data-type="phases">
            SDLC Phase Progression Report
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="width: 220px;">
            <select id="rpt-filter-proj" class="form-control">
              <option value="">All Projects</option>
            </select>
          </div>
          <div style="width: 160px;">
            <select id="rpt-filter-priority" class="form-control">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style="width: 160px;">
            <select id="rpt-filter-status" class="form-control">
              <option value="">All Statuses</option>
            </select>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-apply-report-filter">
            <i data-lucide="filter" style="width: 14px; height: 14px;"></i> Generate Report
          </button>
        </div>
      </div>

      <!-- Generated Report Output Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title" id="rpt-title-label">Report Data</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);" id="rpt-count-label">0 records found</span>
          </div>
        </div>
        <div class="table-responsive" id="rpt-table-container">
          <div style="padding: 32px; text-align: center; color: var(--text-muted);">
            Generating selected report...
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindEvents();
    await this.loadProjectOptions();
    await this.generateReport();
  },

  bindEvents() {
    document.querySelectorAll(".rpt-tab").forEach(btn => {
      btn.onclick = () => {
        this.currentReportType = btn.getAttribute("data-type");
        document.querySelectorAll(".rpt-tab").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        this.generateReport();
      };
    });

    const applyBtn = document.getElementById("btn-apply-report-filter");
    if (applyBtn) {
      applyBtn.onclick = () => this.generateReport();
    }
  },

  async loadProjectOptions() {
    try {
      const projects = await API.projects.list();
      const select = document.getElementById("rpt-filter-proj");
      if (select) {
        select.innerHTML = `<option value="">All Projects</option>` + projects.map(p => `
          <option value="${p.id}">${p.name} (${p.code})</option>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  },

  async generateReport() {
    const container = document.getElementById("rpt-table-container");
    const countLabel = document.getElementById("rpt-count-label");
    const titleLabel = document.getElementById("rpt-title-label");

    const projId = document.getElementById("rpt-filter-proj")?.value || "";
    const priority = document.getElementById("rpt-filter-priority")?.value || "";
    const status = document.getElementById("rpt-filter-status")?.value || "";

    const params = { report_type: this.currentReportType };
    if (projId) params.project_id = projId;
    if (priority) params.priority = priority;
    if (status) params.status = status;

    try {
      const res = await API.reports.custom(params);
      countLabel.textContent = `${res.count} records matching parameters`;
      titleLabel.textContent = `${this.currentReportType.toUpperCase()} Telemetry & Audit Report`;

      this.renderTable(res.data, container);
    } catch (err) {
      container.innerHTML = `<div style="padding: 24px; color: #DC2626; text-align: center;">Error: ${err.message}</div>`;
    }
  },

  renderTable(data, container) {
    if (!data || data.length === 0) {
      container.innerHTML = `<div style="padding: 32px; text-align: center; color: var(--text-muted);">No records found matching the report criteria.</div>`;
      return;
    }

    const type = this.currentReportType;

    if (type === "progress") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Project Name</th>
              <th>Manager</th>
              <th>Current Phase</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(p => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${p.code}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.manager_name}</td>
                <td><span style="font-weight:600; color:var(--brand-forest);">${p.current_phase}</span></td>
                <td><span class="badge badge-${p.priority.toLowerCase()}">${p.priority}</span></td>
                <td><span class="badge badge-completed">${p.status}</span></td>
                <td><strong>${p.progress_percent}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "requirements") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Req Code</th>
              <th>Title</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Owner</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(r => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${r.req_code}</td>
                <td><strong>${r.title}</strong></td>
                <td>${r.project_name}</td>
                <td><span class="badge badge-${r.priority.toLowerCase()}">${r.priority}</span></td>
                <td><span class="badge badge-inprogress">${r.status}</span></td>
                <td>${r.assigned_to_name}</td>
                <td>${r.created_at ? r.created_at.split('T')[0] : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "tasks") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Task Code</th>
              <th>Title</th>
              <th>Project</th>
              <th>SDLC Phase</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(t => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${t.task_code}</td>
                <td><strong>${t.title}</strong></td>
                <td>${t.project_name}</td>
                <td>${t.phase_name}</td>
                <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
                <td><span class="badge badge-inprogress">${t.status}</span></td>
                <td>${t.progress_percent}%</td>
                <td>${t.assigned_to_name}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "testing") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Test Case ID</th>
              <th>Name</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Expected Result</th>
              <th>Actual Result</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(tc => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${tc.case_code}</td>
                <td><strong>${tc.name}</strong></td>
                <td>${tc.project_name}</td>
                <td><span class="badge badge-${tc.priority.toLowerCase()}">${tc.priority}</span></td>
                <td><span class="badge badge-${tc.status.toLowerCase().replace(' ', '-')}">${tc.status}</span></td>
                <td style="font-size:12px; max-width:220px;">${tc.expected_result}</td>
                <td style="font-size:12px; max-width:220px;">${tc.actual_result || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "bugs") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Defect ID</th>
              <th>Title</th>
              <th>Project</th>
              <th>Severity</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Developer Assigned</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(b => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600; color:#DC2626;">${b.bug_code}</td>
                <td><strong>${b.title}</strong></td>
                <td>${b.project_name}</td>
                <td><span class="badge badge-${b.severity.toLowerCase()}">${b.severity}</span></td>
                <td><span class="badge badge-${b.priority.toLowerCase()}">${b.priority}</span></td>
                <td><span class="badge badge-medium">${b.status}</span></td>
                <td>${b.assigned_to_name}</td>
                <td>${b.reported_by_name}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "deployments") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Version Tag</th>
              <th>Project</th>
              <th>Environment</th>
              <th>Status</th>
              <th>Deployed By</th>
              <th>Release Date</th>
              <th>Release Notes</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(d => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 700; color:var(--brand-forest);">${d.version}</td>
                <td>${d.project_name}</td>
                <td><strong>${d.environment}</strong></td>
                <td><span class="badge badge-completed">${d.status}</span></td>
                <td>${d.deployed_by_name}</td>
                <td>${d.deployment_date ? d.deployment_date.split('T')[0] : ''}</td>
                <td style="font-size:12px;">${d.release_notes || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === "phases") {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Phase Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Completion %</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(ph => `
              <tr>
                <td><strong>#${ph.order_index + 1}</strong></td>
                <td><strong>${ph.phase_name}</strong></td>
                <td style="font-size:12.5px;">${ph.description}</td>
                <td><span class="badge badge-inprogress">${ph.status}</span></td>
                <td>${ph.start_date ? ph.start_date.split('T')[0] : 'Pending'}</td>
                <td>${ph.end_date ? ph.end_date.split('T')[0] : 'Pending'}</td>
                <td><strong>${ph.completion_percent}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }
};
