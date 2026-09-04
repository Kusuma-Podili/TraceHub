// Testing & Test Case Suite View

const TestingView = {
  testCases: [],

  async render(container, params = {}) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Quality Assurance & Test Suite</h1>
          <p class="page-subtitle">Preconditions, step-by-step verification, regression executions, and pass-rate telemetry</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-testing">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-create-testcase">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> New Test Case
          </button>
        </div>
      </div>

      <!-- Testing Stats Overview -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="metric-card">
          <span class="metric-label">Total Test Cases</span>
          <span class="metric-value" id="testing-kpi-total">-</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Passed</span>
          <span class="metric-value" id="testing-kpi-passed" style="color: #10B981;">-</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Failed</span>
          <span class="metric-value" id="testing-kpi-failed" style="color: #E11D48;">-</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Blocked / Untested</span>
          <span class="metric-value" id="testing-kpi-blocked" style="color: #F59E0B;">-</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Suite Pass Rate</span>
          <span class="metric-value" id="testing-kpi-rate" style="color: var(--brand-forest-light);">-%</span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="tc-search-input" class="form-control" placeholder="Search test cases by name, code, steps..." />
          </div>
          <div style="width: 200px;">
            <select id="tc-filter-project" class="form-control">
              <option value="">All Projects</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="tc-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Blocked">Blocked</option>
              <option value="Not Executed">Not Executed</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="tc-filter-priority" class="form-control">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Test Cases Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Test Case ID & Name</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Expected Result</th>
                <th>Last Actual Result</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="tc-table-body">
              <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading test cases...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Test Case Modal -->
      <div id="modal-testcase" class="modal-backdrop">
        <div class="modal-dialog" style="max-width: 650px;">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-tc-title">New QA Test Case</h3>
            <button class="modal-close" id="btn-close-tc-modal">&times;</button>
          </div>
          <form id="form-testcase">
            <div class="modal-body">
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px;">
                <div class="form-group" id="group-tc-project">
                  <label class="form-label">Project</label>
                  <select id="tc-form-project" class="form-control" required>
                    <!-- Populated dynamically -->
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="tc-form-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Test Case Name</label>
                <input type="text" id="tc-form-name" class="form-control" placeholder="e.g. Verify WebRTC SDP Exchange under high latency" required />
              </div>
              <div class="form-group">
                <label class="form-label">Preconditions</label>
                <input type="text" id="tc-form-preconditions" class="form-control" placeholder="e.g. Browser client running Chrome 120+, 100Mbps connection" />
              </div>
              <div class="form-group">
                <label class="form-label">Detailed Test Steps</label>
                <textarea id="tc-form-steps" class="form-control" style="height: 110px;" placeholder="1. Open client...&#10;2. Connect to matchmaking queue...&#10;3. Verify ICE connection state changes to connected..." required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Expected Result</label>
                <textarea id="tc-form-expected" class="form-control" style="height: 80px;" placeholder="Video stream initializes within 200ms with zero packet dropped..." required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-tc-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Test Case</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Execute Test Case Modal -->
      <div id="modal-execute-test" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Execute Test Case</h3>
            <button class="modal-close" id="btn-close-exec-modal">&times;</button>
          </div>
          <form id="form-execute-test">
            <input type="hidden" id="exec-tc-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="exec-tc-code">TC-001</div>
                <strong style="font-size: 14px;" id="exec-tc-name">Test Case Name</strong>
              </div>

              <div style="font-size: 12.5px; color: var(--text-secondary); background: #FFF; border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px; margin: 12px 0;">
                <div style="font-weight: 600; margin-bottom: 4px;">Test Steps:</div>
                <div id="exec-tc-steps" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 12px;"></div>
                <div style="font-weight: 600; margin-top: 8px; margin-bottom: 4px;">Expected Result:</div>
                <div id="exec-tc-expected"></div>
              </div>

              <div class="form-group">
                <label class="form-label">Execution Result</label>
                <select id="exec-tc-status" class="form-control" required>
                  <option value="Passed">Passed (Meets all acceptance criteria)</option>
                  <option value="Failed">Failed (Defect observed)</option>
                  <option value="Blocked">Blocked (External roadblock)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Actual Result Observed</label>
                <textarea id="exec-tc-actual" class="form-control" placeholder="Describe actual system response during test execution..." required rows="3"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Execution Time (ms)</label>
                <input type="number" id="exec-tc-duration" class="form-control" value="150" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-exec-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Test Execution</button>
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

    if (params.openModal) {
      document.getElementById("btn-create-testcase").click();
    }
  },

  bindEvents() {
    const refreshBtn = document.getElementById("btn-refresh-testing");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Modal
    const modal = document.getElementById("modal-testcase");
    const openBtn = document.getElementById("btn-create-testcase");
    const closeBtn = document.getElementById("btn-close-tc-modal");
    const cancelBtn = document.getElementById("btn-cancel-tc-modal");
    const form = document.getElementById("form-testcase");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        form.reset();
        modal.classList.add("active");
        try {
          const projects = await API.projects.list();
          const projSelect = document.getElementById("tc-form-project");
          projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');
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
        const project_id = parseInt(document.getElementById("tc-form-project").value);
        const name = document.getElementById("tc-form-name").value.trim();
        const preconditions = document.getElementById("tc-form-preconditions").value.trim();
        const test_steps = document.getElementById("tc-form-steps").value.trim();
        const expected_result = document.getElementById("tc-form-expected").value.trim();
        const priority = document.getElementById("tc-form-priority").value;

        try {
          const res = await API.testing.create({ project_id, name, preconditions, test_steps, expected_result, priority });
          API.toast(`Test Case '${res.case_code}' created!`, "success");
          modal.classList.remove("active");
          form.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Execute Test Modal
    const execModal = document.getElementById("modal-execute-test");
    const closeExecBtn = document.getElementById("btn-close-exec-modal");
    const cancelExecBtn = document.getElementById("btn-cancel-exec-modal");
    const execForm = document.getElementById("form-execute-test");

    if (closeExecBtn && execModal) {
      closeExecBtn.onclick = () => execModal.classList.remove("active");
      cancelExecBtn.onclick = () => execModal.classList.remove("active");
    }

    if (execForm) {
      execForm.onsubmit = async (e) => {
        e.preventDefault();
        const caseId = parseInt(document.getElementById("exec-tc-id").value);
        const status = document.getElementById("exec-tc-status").value;
        const actual_result = document.getElementById("exec-tc-actual").value.trim();
        const execution_time_ms = parseInt(document.getElementById("exec-tc-duration").value) || 150;

        try {
          await API.testing.execute(caseId, { status, actual_result, execution_time_ms });
          API.toast(`Test execution saved: ${status}!`, status === "Passed" ? "success" : "warning");
          execModal.classList.remove("active");
          execForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Filter controls
    const searchInput = document.getElementById("tc-search-input");
    const filterProj = document.getElementById("tc-filter-project");
    const filterSt = document.getElementById("tc-filter-status");
    const filterPri = document.getElementById("tc-filter-priority");

    const applyFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const projId = filterProj.value;
      const st = filterSt.value;
      const pri = filterPri.value;

      const filtered = this.testCases.filter(tc => {
        const matchesQ = !q || tc.case_code.toLowerCase().includes(q) || tc.name.toLowerCase().includes(q) || (tc.test_steps && tc.test_steps.toLowerCase().includes(q));
        const matchesProj = !projId || tc.project_id == projId;
        const matchesSt = !st || tc.status === st;
        const matchesPri = !pri || tc.priority === pri;
        return matchesQ && matchesProj && matchesSt && matchesPri;
      });

      this.renderTable(filtered);
    };

    if (searchInput) searchInput.oninput = applyFilter;
    if (filterProj) filterProj.onchange = applyFilter;
    if (filterSt) filterSt.onchange = applyFilter;
    if (filterPri) filterPri.onchange = applyFilter;
  },

  async loadProjectsFilter(selectedProjId) {
    try {
      const projects = await API.projects.list();
      const select = document.getElementById("tc-filter-project");
      if (select) {
        select.innerHTML = `<option value="">All Projects</option>` + projects.map(p => `
          <option value="${p.id}" ${selectedProjId && selectedProjId == p.id ? 'selected' : ''}>${p.name} (${p.code})</option>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  },

  async loadData(projectId = null) {
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      this.testCases = await API.testing.list(params);

      // Stats
      const stats = await API.testing.stats(projectId);
      document.getElementById("testing-kpi-total").textContent = stats.total;
      document.getElementById("testing-kpi-passed").textContent = stats.passed;
      document.getElementById("testing-kpi-failed").textContent = stats.failed;
      document.getElementById("testing-kpi-blocked").textContent = stats.blocked + stats.not_executed;
      document.getElementById("testing-kpi-rate").textContent = `${stats.pass_rate_percent}%`;

      this.renderTable(this.testCases);
    } catch (err) {
      API.toast("Failed to load test cases: " + err.message, "error");
    }
  },

  renderTable(cases) {
    const tbody = document.getElementById("tc-table-body");
    if (!tbody) return;

    if (!cases || cases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">No test cases found.</td></tr>`;
      return;
    }

    tbody.innerHTML = cases.map(tc => {
      const statusKey = tc.status.toLowerCase().replace(' ', '-');
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${tc.name}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${tc.case_code}</div>
          </td>
          <td style="color: var(--text-secondary); font-size: 13px;">${tc.project_name}</td>
          <td><span class="badge badge-${tc.priority.toLowerCase()}">${tc.priority}</span></td>
          <td><span class="badge badge-${statusKey}">${tc.status}</span></td>
          <td style="font-size: 12px; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${tc.expected_result}
          </td>
          <td style="font-size: 12px; color: var(--text-muted); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${tc.actual_result || 'Not executed'}
          </td>
          <td style="text-align: right;">
            <button class="btn btn-primary btn-sm" onclick="TestingView.openExecuteModal(${tc.id})">
              Execute Test
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  openExecuteModal(caseId) {
    const tc = this.testCases.find(item => item.id === caseId);
    if (!tc) return;

    const modal = document.getElementById("modal-execute-test");
    document.getElementById("exec-tc-id").value = tc.id;
    document.getElementById("exec-tc-code").textContent = tc.case_code;
    document.getElementById("exec-tc-name").textContent = tc.name;
    document.getElementById("exec-tc-steps").textContent = tc.test_steps || "None specified";
    document.getElementById("exec-tc-expected").textContent = tc.expected_result || "None specified";
    document.getElementById("exec-tc-actual").value = "";
    document.getElementById("exec-tc-status").value = "Passed";
    modal.classList.add("active");
  }
};
