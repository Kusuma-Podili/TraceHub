// Testing Workspace View

const QADashboardView = {
  tasksReady: [],
  retestingBugs: [],
  testCases: [],

  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Testing Workspace</h1>
          <p class="page-subtitle">Validate developer task deliverables, execute QA suites, report defects, and verify retests</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-qa">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-new-tc-qa">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> New Test Case
          </button>
          <button class="btn btn-primary" id="btn-report-bug-qa" style="background-color: #E11D48; border-color: #E11D48;">
            <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i> Report Defect
          </button>
        </div>
      </div>

      <!-- Testing KPI Metrics -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card" style="border-top: 3px solid #8B5CF6;">
          <span class="metric-label">Tasks for Testing</span>
          <span class="metric-value" id="qa-ready-tasks-count" style="color: #8B5CF6;">-</span>
          <span class="metric-sub">Submitted by developers</span>
        </div>
        <div class="metric-card" style="border-top: 3px solid #D97706;">
          <span class="metric-label">Retesting Queue</span>
          <span class="metric-value" id="qa-retesting-count" style="color: #D97706;">-</span>
          <span class="metric-sub">Patched bugs to verify</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Total Test Cases</span>
          <span class="metric-value" id="qa-total-tests">-</span>
          <span class="metric-sub">Across active suites</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Passed Tests</span>
          <span class="metric-value" id="qa-passed-tests" style="color: #10B981;">-</span>
          <span class="metric-sub">Successful runs</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Failed Tests</span>
          <span class="metric-value" id="qa-failed-tests" style="color: #E11D48;">-</span>
          <span class="metric-sub">Defects observed</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Pass Rate</span>
          <span class="metric-value" id="qa-pass-rate" style="color: var(--brand-forest); font-weight: 800;">-%</span>
          <span class="metric-sub">Verification success</span>
        </div>
      </div>

      <!-- Section 1: Tasks Ready for QA Testing -->
      <div class="card" style="margin-bottom: 24px; border-top: 3px solid #8B5CF6;">
        <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 class="card-title">Tasks Ready for QA Testing</h3>
            <span style="font-size: 12px; color: var(--text-muted);">Development completed tasks requiring QA verification before marking completed</span>
          </div>
          <span class="badge" style="background: #EDE9FE; color: #6D28D9;" id="qa-tasks-ready-badge">0 Ready</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Task Code & Title</th>
                <th>Project</th>
                <th>Phase</th>
                <th>Developer</th>
                <th>Progress</th>
                <th>Testing Status</th>
                <th style="text-align: right;">QA Actions</th>
              </tr>
            </thead>
            <tbody id="qa-tasks-ready-tbody">
              <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 28px;">
                  Loading tasks submitted for QA...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Two-Column Layout: Retesting Queue & Test Case Suite -->
      <div style="display: grid; grid-template-columns: 1.3fr 2fr; gap: 24px; align-items: flex-start;">
        <!-- Left: Retesting Queue (Developer Fixed Defects Waiting for Retest) -->
        <div class="card" style="border-top: 3px solid #D97706;">
          <div class="card-header">
            <div>
              <h3 class="card-title">Bugs Ready for Retesting</h3>
              <span style="font-size: 11.5px; color: var(--text-muted);">Patched by developers; verify before closing</span>
            </div>
            <span class="badge" id="qa-retest-badge" style="background: #FEF3C7; color: #92400E;">0 Ready</span>
          </div>
          <div class="card-body" id="qa-retest-container" style="display: flex; flex-direction: column; gap: 14px; padding: 16px;">
            <div style="text-align: center; color: var(--text-muted); padding: 24px;">No defects awaiting retest.</div>
          </div>
        </div>

        <!-- Right: Test Cases & Direct Execution Runner -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Active Test Suite Execution</h3>
              <span style="font-size: 11.5px; color: var(--text-muted);">Run test cases against acceptance criteria</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('test-cases')">
              View All Test Cases
            </button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Test Code & Name</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Preconditions</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody id="qa-tests-tbody">
                <tr>
                  <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">
                    Loading test suite...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Fail Testing & Log Defect Modal -->
      <div id="modal-fail-task" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" style="color: #991B1B;">Fail Task QA & Report Defect</h3>
            <button class="modal-close" id="btn-close-fail-modal">&times;</button>
          </div>
          <form id="form-fail-task">
            <input type="hidden" id="fail-task-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13px; margin-bottom: 12px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="fail-task-code">TASK-001</span>
                <div style="font-weight: 600; margin-top: 4px;" id="fail-task-title">Task Title</div>
              </div>
              <div class="form-group">
                <label class="form-label">Defect Title</label>
                <input type="text" id="fail-bug-title" class="form-control" placeholder="e.g. Acceptance test failure: 500 error on checkout submission" required />
              </div>
              <div class="form-group">
                <label class="form-label">Defect Description / Reproduction Steps</label>
                <textarea id="fail-bug-desc" class="form-control" placeholder="1. Set up test state... 2. Run action... 3. Expected vs Actual..." required rows="4"></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Severity</label>
                  <select id="fail-bug-severity" class="form-control">
                    <option value="Critical">Critical</option>
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="fail-bug-priority" class="form-control">
                    <option value="Critical">Critical</option>
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <span style="font-size: 11.5px; color: var(--text-muted);">
                Failing this test will transition the task back to <strong>In Progress</strong> and assign the defect directly to the developer for patching.
              </span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-fail-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" style="background-color: #E11D48; border-color: #E11D48;">Fail Task & File Bug</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Execute Test Case Modal -->
      <div id="modal-run-test" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Execute Test Case</h3>
            <button class="modal-close" id="btn-close-run-modal">&times;</button>
          </div>
          <form id="form-run-test">
            <input type="hidden" id="run-tc-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="run-tc-code">TC-001</div>
                <strong style="font-size: 14px;" id="run-tc-name">Test Case Name</strong>
              </div>

              <div style="font-size: 12.5px; color: var(--text-secondary); background: #FFF; border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px; margin: 12px 0;">
                <div style="font-weight: 600; margin-bottom: 4px;">Test Steps:</div>
                <div id="run-tc-steps" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 12px;"></div>
                <div style="font-weight: 600; margin-top: 8px; margin-bottom: 4px;">Expected Result:</div>
                <div id="run-tc-expected"></div>
              </div>

              <div class="form-group">
                <label class="form-label">Execution Result</label>
                <select id="run-tc-status" class="form-control" required>
                  <option value="Passed">Passed (Meets all acceptance criteria)</option>
                  <option value="Failed">Failed (Defect observed)</option>
                  <option value="Blocked">Blocked (External roadblock)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Actual Result Observed</label>
                <textarea id="run-tc-actual" class="form-control" placeholder="Describe actual system response during test execution..." required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Execution Time (ms)</label>
                <input type="number" id="run-tc-duration" class="form-control" value="150" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-run-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Test Execution</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Retest Bug Modal -->
      <div id="modal-retest-bug" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Verify Defect Fix (QA Retest)</h3>
            <button class="modal-close" id="btn-close-retest-modal">&times;</button>
          </div>
          <form id="form-retest-bug">
            <input type="hidden" id="retest-bug-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 12px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="retest-bug-code">BUG-001</div>
                <strong style="font-size: 14px;" id="retest-bug-title">Bug Title</strong>
                <div style="margin-top: 8px; font-size: 12px; color: var(--brand-forest); background: #FFF; padding: 8px; border-radius: 4px; border: 1px solid var(--border-subtle);" id="retest-developer-notes">
                  <strong>Developer Fix Note:</strong> <span></span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Retest Verdict</label>
                <select id="retest-verdict" class="form-control" required>
                  <option value="true">Passed (Fix verified, Close Defect)</option>
                  <option value="false">Failed (Defect still reproduces, Reopen Defect)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">QA Retest Notes / Proof</label>
                <textarea id="retest-notes" class="form-control" placeholder="Specify verification steps and test telemetry logs..." required rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-retest-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Retest Verdict</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Report Bug Modal -->
      <div id="modal-report-bug" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Report New Software Defect</h3>
            <button class="modal-close" id="btn-close-report-bug">&times;</button>
          </div>
          <form id="form-report-bug">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Project</label>
                <select id="bug-project-id" class="form-control" required>
                  <!-- Dynamically populated -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Defect Title</label>
                <input type="text" id="bug-title" class="form-control" placeholder="e.g. Memory leak during WebRTC disconnect" required />
              </div>
              <div class="form-group">
                <label class="form-label">Detailed Reproduction Steps & Description</label>
                <textarea id="bug-description" class="form-control" placeholder="1. Open app... 2. Trigger action... 3. Observe crash..." required rows="3"></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Severity</label>
                  <select id="bug-severity" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="bug-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Assign to Developer</label>
                <select id="bug-assign-to" class="form-control">
                  <option value="">-- Unassigned --</option>
                  <!-- Populated dynamically -->
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-report-bug">Cancel</button>
              <button type="submit" class="btn btn-primary" style="background-color: #E11D48; border-color: #E11D48;">Submit Bug Report</button>
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
    const refreshBtn = document.getElementById("btn-refresh-qa");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Fail Task Modal
    const failModal = document.getElementById("modal-fail-task");
    const closeFailBtn = document.getElementById("btn-close-fail-modal");
    const cancelFailBtn = document.getElementById("btn-cancel-fail-modal");
    const failForm = document.getElementById("form-fail-task");

    if (closeFailBtn && failModal) {
      closeFailBtn.onclick = () => failModal.classList.remove("active");
      cancelFailBtn.onclick = () => failModal.classList.remove("active");
    }

    if (failForm) {
      failForm.onsubmit = async (e) => {
        e.preventDefault();
        const taskId = parseInt(document.getElementById("fail-task-id").value);
        const title = document.getElementById("fail-bug-title").value.trim();
        const description = document.getElementById("fail-bug-desc").value.trim();
        const severity = document.getElementById("fail-bug-severity").value;
        const priority = document.getElementById("fail-bug-priority").value;

        try {
          const res = await API.tasks.failTesting(taskId, {
            bug_title: title,
            bug_description: description,
            bug_severity: severity,
            bug_priority: priority
          });
          API.toast(`Task QA failed. Defect '${res.bug ? res.bug.bug_code : 'Reported'}' filed and returned to developer.`, "warning");
          failModal.classList.remove("active");
          failForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Run Test Modal
    const runModal = document.getElementById("modal-run-test");
    const closeRunBtn = document.getElementById("btn-close-run-modal");
    const cancelRunBtn = document.getElementById("btn-cancel-run-modal");
    const runForm = document.getElementById("form-run-test");

    if (closeRunBtn && runModal) {
      closeRunBtn.onclick = () => runModal.classList.remove("active");
      cancelRunBtn.onclick = () => runModal.classList.remove("active");
    }

    if (runForm) {
      runForm.onsubmit = async (e) => {
        e.preventDefault();
        const caseId = document.getElementById("run-tc-id").value;
        const status = document.getElementById("run-tc-status").value;
        const actual_result = document.getElementById("run-tc-actual").value.trim();
        const execution_time_ms = parseInt(document.getElementById("run-tc-duration").value) || 100;

        try {
          await API.testing.execute(caseId, { status, actual_result, execution_time_ms });
          API.toast(`Test execution saved as: ${status}!`, status === "Passed" ? "success" : "warning");
          runModal.classList.remove("active");
          runForm.reset();
          this.loadData();

          if (status === "Failed") {
            if (confirm("This test failed. Would you like to immediately file a defect bug report?")) {
              document.getElementById("btn-report-bug-qa").click();
            }
          }
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Retest Bug Modal
    const retestModal = document.getElementById("modal-retest-bug");
    const closeRetestBtn = document.getElementById("btn-close-retest-modal");
    const cancelRetestBtn = document.getElementById("btn-cancel-retest-modal");
    const retestForm = document.getElementById("form-retest-bug");

    if (closeRetestBtn && retestModal) {
      closeRetestBtn.onclick = () => retestModal.classList.remove("active");
      cancelRetestBtn.onclick = () => retestModal.classList.remove("active");
    }

    if (retestForm) {
      retestForm.onsubmit = async (e) => {
        e.preventDefault();
        const bugId = document.getElementById("retest-bug-id").value;
        const passed = document.getElementById("retest-verdict").value === "true";
        const retest_notes = document.getElementById("retest-notes").value.trim();

        try {
          const res = await API.bugs.retest(bugId, passed, retest_notes);
          API.toast(res.message, passed ? "success" : "warning");
          retestModal.classList.remove("active");
          retestForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Report Bug Modal
    const reportModal = document.getElementById("modal-report-bug");
    const openReportBtn = document.getElementById("btn-report-bug-qa");
    const closeReportBtn = document.getElementById("btn-close-report-bug");
    const cancelReportBtn = document.getElementById("btn-cancel-report-bug");
    const reportForm = document.getElementById("form-report-bug");

    if (openReportBtn && reportModal) {
      openReportBtn.onclick = async () => {
        reportModal.classList.add("active");
        try {
          const projects = await API.projects.list();
          const projSelect = document.getElementById("bug-project-id");
          projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

          const devs = await API.auth.getUsers("Developer");
          const devSelect = document.getElementById("bug-assign-to");
          devSelect.innerHTML = `<option value="">-- Unassigned --</option>` + devs.map(d => `<option value="${d.id}">${d.full_name}</option>`).join('');
        } catch (err) {
          console.error(err);
        }
      };

      closeReportBtn.onclick = () => reportModal.classList.remove("active");
      cancelReportBtn.onclick = () => reportModal.classList.remove("active");
    }

    if (reportForm) {
      reportForm.onsubmit = async (e) => {
        e.preventDefault();
        const project_id = parseInt(document.getElementById("bug-project-id").value);
        const title = document.getElementById("bug-title").value.trim();
        const description = document.getElementById("bug-description").value.trim();
        const severity = document.getElementById("bug-severity").value;
        const priority = document.getElementById("bug-priority").value;
        const assignedVal = document.getElementById("bug-assign-to").value;
        const assigned_to_id = assignedVal ? parseInt(assignedVal) : null;

        try {
          const res = await API.bugs.report({
            project_id, title, description, severity, priority, assigned_to_id
          });
          API.toast(`Bug '${res.bug_code}' filed successfully!`, "success");
          reportModal.classList.remove("active");
          reportForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // New Test Case Button
    const newTcBtn = document.getElementById("btn-new-tc-qa");
    if (newTcBtn) {
      newTcBtn.onclick = () => window.App.navigate("test-cases", { openModal: true });
    }
  },

  async loadData() {
    try {
      const data = await API.reports.qaDashboard();

      this.tasksReady = data.tasks_ready_for_testing || [];
      this.retestingBugs = data.retesting_bugs || [];
      this.testCases = data.recent_test_cases || [];

      document.getElementById("qa-ready-tasks-count").textContent = data.ready_testing_tasks_count || this.tasksReady.length;
      document.getElementById("qa-tasks-ready-badge").textContent = `${data.ready_testing_tasks_count || this.tasksReady.length} Ready`;
      document.getElementById("qa-retesting-count").textContent = data.retesting_queue_count;
      document.getElementById("qa-retest-badge").textContent = `${data.retesting_queue_count} Ready`;

      document.getElementById("qa-total-tests").textContent = data.total_tests;
      document.getElementById("qa-passed-tests").textContent = data.passed_tests;
      document.getElementById("qa-failed-tests").textContent = data.failed_tests;
      document.getElementById("qa-pass-rate").textContent = `${data.pass_rate_percent}%`;

      // Render all 3 sections
      this.renderTasksReady();
      this.renderRetestQueue(this.retestingBugs);
      this.renderTestCases(this.testCases);
    } catch (err) {
      API.toast("Failed to load QA metrics: " + err.message, "error");
    }
  },

  renderTasksReady() {
    const tbody = document.getElementById("qa-tasks-ready-tbody");
    if (!tbody) return;

    if (!this.tasksReady || this.tasksReady.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 28px;">
            No tasks currently waiting in QA pipeline. Developers will submit tasks here once ready.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.tasksReady.map(t => {
      const isReady = t.status === "Ready for Testing";
      const isTesting = t.status === "Testing";

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${t.title}</div>
            <div style="font-size: 11px; color: var(--brand-forest); font-family: var(--font-mono);">${t.task_code}</div>
          </td>
          <td style="font-size: 13px; color: var(--text-secondary);">${t.project_name || 'Project'}</td>
          <td style="font-size: 12.5px;">${t.phase_name}</td>
          <td style="font-size: 12.5px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--brand-forest);"></span>
              ${t.assigned_to_name || 'Unassigned'}
            </div>
          </td>
          <td style="width: 100px;">
            <span style="font-size: 12px; font-weight: 600;">${t.progress_percent}%</span>
          </td>
          <td>
            <span class="badge" style="${isReady ? 'background:#EDE9FE; color:#6D28D9;' : 'background:#DBEAFE; color:#1D4ED8;'}">
              ${isReady ? 'Ready for Testing' : 'In Testing'}
            </span>
          </td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              ${isReady ? `
                <button class="btn btn-primary btn-sm" onclick="QADashboardView.startTesting(${t.id})">
                  <i data-lucide="play" style="width: 13px; height: 13px;"></i> Start Testing
                </button>
              ` : ''}

              ${isTesting ? `
                <button class="btn btn-primary btn-sm" style="background: #10B981; border-color: #10B981;" onclick="QADashboardView.passTesting(${t.id})">
                  <i data-lucide="check" style="width: 13px; height: 13px;"></i> Pass
                </button>
                <button class="btn btn-primary btn-sm" style="background: #E11D48; border-color: #E11D48;" onclick="QADashboardView.openFailTestingModal(${t.id})">
                  <i data-lucide="x" style="width: 13px; height: 13px;"></i> Fail
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async startTesting(taskId) {
    try {
      await API.tasks.startTesting(taskId);
      API.toast("Task testing started. Validate acceptance criteria.", "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async passTesting(taskId) {
    if (!confirm("Confirm all test cases and acceptance criteria have PASSED for this task? This will complete the task.")) {
      return;
    }

    try {
      await API.tasks.passTesting(taskId);
      API.toast("Task successfully PASSED testing and marked as Completed!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  openFailTestingModal(taskId) {
    const t = this.tasksReady.find(item => item.id === taskId);
    if (!t) return;

    const modal = document.getElementById("modal-fail-task");
    document.getElementById("fail-task-id").value = t.id;
    document.getElementById("fail-task-code").textContent = t.task_code;
    document.getElementById("fail-task-title").textContent = t.title;
    document.getElementById("fail-bug-title").value = `QA Failure on [${t.task_code}] ${t.title}`;
    document.getElementById("fail-bug-desc").value = "";
    modal.classList.add("active");
  },

  renderRetestQueue(bugs) {
    const container = document.getElementById("qa-retest-container");
    if (!container) return;

    if (!bugs || bugs.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px;">No defects currently waiting for QA verification.</div>`;
      return;
    }

    container.innerHTML = bugs.map(b => `
      <div style="background: #FFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 11px; color: #6D28D9; font-weight: 700;">${b.bug_code}</span>
          <span class="badge badge-${b.severity.toLowerCase()}">${b.severity}</span>
        </div>
        <div style="font-weight: 600; font-size: 13.5px; margin-top: 4px;">${b.title}</div>
        <div style="font-size: 12px; color: var(--brand-forest); margin: 6px 0; background: var(--bg-secondary); padding: 8px; border-radius: 4px;">
          <strong>Developer Fix Note:</strong> ${b.resolution_notes || 'Resolved by developer.'}
        </div>
        <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center; margin-top: 6px;" onclick="QADashboardView.openRetestModal(${b.id})">
          <i data-lucide="check-square" style="width: 13px; height: 13px;"></i> Retest Defect
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  renderTestCases(cases) {
    const tbody = document.getElementById("qa-tests-tbody");
    if (!tbody) return;

    if (!cases || cases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No test cases found.</td></tr>`;
      return;
    }

    tbody.innerHTML = cases.map(tc => {
      const statusKey = tc.status.toLowerCase().replace(' ', '-');
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${tc.name}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${tc.case_code} · ${tc.project_name}</div>
          </td>
          <td><span class="badge badge-${tc.priority.toLowerCase()}">${tc.priority}</span></td>
          <td><span class="badge badge-${statusKey}">${tc.status}</span></td>
          <td style="font-size: 12px; color: var(--text-secondary); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${tc.preconditions || 'None specified'}
          </td>
          <td style="text-align: right;">
            <button class="btn btn-primary btn-sm" onclick="QADashboardView.openRunTestModal(${tc.id})">
              Run Test
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  openRunTestModal(id) {
    const tc = this.testCases.find(item => item.id === id);
    if (!tc) return;

    const modal = document.getElementById("modal-run-test");
    document.getElementById("run-tc-id").value = tc.id;
    document.getElementById("run-tc-code").textContent = tc.case_code;
    document.getElementById("run-tc-name").textContent = tc.name;
    document.getElementById("run-tc-steps").textContent = tc.test_steps || "None specified";
    document.getElementById("run-tc-expected").textContent = tc.expected_result || "None specified";
    document.getElementById("run-tc-actual").value = "";
    document.getElementById("run-tc-status").value = "Passed";
    modal.classList.add("active");
  },

  openRetestModal(id) {
    const b = this.retestingBugs.find(item => item.id === id);
    if (!b) return;

    const modal = document.getElementById("modal-retest-bug");
    document.getElementById("retest-bug-id").value = b.id;
    document.getElementById("retest-bug-code").textContent = b.bug_code;
    document.getElementById("retest-bug-title").textContent = b.title;
    document.querySelector("#retest-developer-notes span").textContent = b.resolution_notes || "Resolved by developer.";
    document.getElementById("retest-notes").value = "";
    document.getElementById("retest-verdict").value = "true";
    modal.classList.add("active");
  }
};
