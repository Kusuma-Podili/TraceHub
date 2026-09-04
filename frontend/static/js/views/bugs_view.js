// Bugs Management & Retesting Lifecycle View

const BugsView = {
  bugs: [],

  async render(container, params = {}) {
    const user = API.getUser() || {};
    const canReport = user.role === "Tester" || user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Defect Tracking & Retesting Lifecycle</h1>
          <p class="page-subtitle">Report defects, assign engineering owners, track patch resolutions, and verify retests</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-bugs">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          ${canReport ? `
            <button class="btn btn-primary" id="btn-report-bug-page" style="background-color: #E11D48; border-color: #E11D48;">
              <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i> Report Defect
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="bug-search-input" class="form-control" placeholder="Search defects by code, title, details..." />
          </div>
          <div style="width: 180px;">
            <select id="bug-filter-proj" class="form-control">
              <option value="">All Projects</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="bug-filter-sev" class="form-control">
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style="width: 160px;">
            <select id="bug-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready for Retesting">Ready for Retesting</option>
              <option value="Closed">Closed</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bugs Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Defect ID & Title</th>
                <th>Project</th>
                <th>Severity</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Developer</th>
                <th>Reported By</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="bugs-table-body">
              <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                  Loading defects...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mark Bug Fixed Modal -->
      <div id="modal-fix-bug-page" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Mark Bug as Fixed & Queue for Retest</h3>
            <button class="modal-close" id="btn-close-fix-modal-page">&times;</button>
          </div>
          <form id="form-submit-bug-fix-page">
            <input type="hidden" id="fix-bug-id-page" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13px; margin-bottom: 14px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: #DC2626; font-weight: 700;" id="fix-bug-code-page">BUG-001</span>
                <div style="font-weight: 600; margin-top: 4px;" id="fix-bug-title-page">Defect Title</div>
              </div>
              <div class="form-group">
                <label class="form-label">Resolution Notes & Commit References</label>
                <textarea id="fix-resolution-notes-page" class="form-control" placeholder="Describe root cause fix, PR link, and verified patches..." required rows="4"></textarea>
                <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
                  This moves the defect to <strong>Ready for Retesting</strong>. QA will verify the fix before closing.
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-fix-modal-page">Cancel</button>
              <button type="submit" class="btn btn-primary">Mark as Fixed</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Retest Bug Modal -->
      <div id="modal-retest-bug-page" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Verify Defect Fix (QA Retest)</h3>
            <button class="modal-close" id="btn-close-retest-modal-page">&times;</button>
          </div>
          <form id="form-retest-bug-page">
            <input type="hidden" id="retest-bug-id-page" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 12px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="retest-bug-code-page">BUG-001</div>
                <strong style="font-size: 14px;" id="retest-bug-title-page">Bug Title</strong>
                <div style="margin-top: 8px; font-size: 12px; color: var(--brand-forest); background: #FFF; padding: 8px; border-radius: 4px; border: 1px solid var(--border-subtle);" id="retest-dev-notes-page">
                  <strong>Developer Fix Note:</strong> <span></span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Retest Verdict</label>
                <select id="retest-verdict-page" class="form-control" required>
                  <option value="true">Passed (Fix verified, Close Defect)</option>
                  <option value="false">Failed (Defect still reproduces, Reopen Defect)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">QA Retest Notes / Proof</label>
                <textarea id="retest-notes-page" class="form-control" placeholder="Specify verification steps and test telemetry logs..." required rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-retest-modal-page">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Retest Verdict</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Report Defect Modal -->
      <div id="modal-report-bug-page" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Report New Software Defect</h3>
            <button class="modal-close" id="btn-close-report-modal-page">&times;</button>
          </div>
          <form id="form-report-bug-page">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Project</label>
                <select id="page-bug-project" class="form-control" required></select>
              </div>
              <div class="form-group">
                <label class="form-label">Defect Title</label>
                <input type="text" id="page-bug-title" class="form-control" placeholder="e.g. Memory leak during WebRTC disconnect" required />
              </div>
              <div class="form-group">
                <label class="form-label">Detailed Reproduction Steps & Description</label>
                <textarea id="page-bug-desc" class="form-control" placeholder="1. Open app... 2. Trigger action... 3. Observe crash..." required rows="3"></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Severity</label>
                  <select id="page-bug-severity" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="page-bug-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Assign to Developer</label>
                <select id="page-bug-assigned" class="form-control">
                  <option value="">-- Unassigned --</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-report-modal-page">Cancel</button>
              <button type="submit" class="btn btn-primary" style="background-color: #E11D48; border-color: #E11D48;">Submit Bug Report</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bug Details Modal -->
      <div id="modal-detail-bug-page" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="detail-bug-title-header">Defect Details</h3>
            <button class="modal-close" id="btn-close-detail-modal-page">&times;</button>
          </div>
          <div class="modal-body" id="detail-bug-body" style="font-size: 13px; display: flex; flex-direction: column; gap: 12px;"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-detail-modal-page">Close</button>
          </div>
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
    const refreshBtn = document.getElementById("btn-refresh-bugs");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Report Defect Button & Modal
    const reportBtn = document.getElementById("btn-report-bug-page");
    const reportModal = document.getElementById("modal-report-bug-page");
    const closeReportBtn = document.getElementById("btn-close-report-modal-page");
    const cancelReportBtn = document.getElementById("btn-cancel-report-modal-page");
    const reportForm = document.getElementById("form-report-bug-page");

    if (reportBtn && reportModal) {
      reportBtn.onclick = async () => {
        reportModal.classList.add("active");
        try {
          const projects = await API.projects.list();
          const projSelect = document.getElementById("page-bug-project");
          projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

          const devs = await API.auth.getUsers("Developer");
          const devSelect = document.getElementById("page-bug-assigned");
          devSelect.innerHTML = `<option value="">-- Unassigned --</option>` + devs.map(d => `<option value="${d.id}">${d.full_name}</option>`).join('');
        } catch (err) {
          console.error(err);
        }
      };

      if (closeReportBtn) closeReportBtn.onclick = () => reportModal.classList.remove("active");
      if (cancelReportBtn) cancelReportBtn.onclick = () => reportModal.classList.remove("active");
    }

    if (reportForm) {
      reportForm.onsubmit = async (e) => {
        e.preventDefault();
        const project_id = parseInt(document.getElementById("page-bug-project").value);
        const title = document.getElementById("page-bug-title").value.trim();
        const description = document.getElementById("page-bug-desc").value.trim();
        const severity = document.getElementById("page-bug-severity").value;
        const priority = document.getElementById("page-bug-priority").value;
        const assignedVal = document.getElementById("page-bug-assigned").value;
        const assigned_to_id = assignedVal ? parseInt(assignedVal) : null;

        try {
          const res = await API.bugs.report({ project_id, title, description, severity, priority, assigned_to_id });
          API.toast(`Defect '${res.bug_code}' filed successfully!`, "success");
          reportModal.classList.remove("active");
          reportForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Fix Bug Modal Events
    const fixModal = document.getElementById("modal-fix-bug-page");
    const closeFixBtn = document.getElementById("btn-close-fix-modal-page");
    const cancelFixBtn = document.getElementById("btn-cancel-fix-modal-page");
    const fixForm = document.getElementById("form-submit-bug-fix-page");

    if (closeFixBtn && fixModal) {
      closeFixBtn.onclick = () => fixModal.classList.remove("active");
      cancelFixBtn.onclick = () => fixModal.classList.remove("active");
    }

    if (fixForm) {
      fixForm.onsubmit = async (e) => {
        e.preventDefault();
        const bugId = parseInt(document.getElementById("fix-bug-id-page").value);
        const notes = document.getElementById("fix-resolution-notes-page").value.trim();

        try {
          await API.bugs.markFixed(bugId, notes);
          API.toast("Bug marked as Fixed and queued for QA Retest!", "success");
          fixModal.classList.remove("active");
          fixForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Retest Bug Modal Events
    const retestModal = document.getElementById("modal-retest-bug-page");
    const closeRetestBtn = document.getElementById("btn-close-retest-modal-page");
    const cancelRetestBtn = document.getElementById("btn-cancel-retest-modal-page");
    const retestForm = document.getElementById("form-retest-bug-page");

    if (closeRetestBtn && retestModal) {
      closeRetestBtn.onclick = () => retestModal.classList.remove("active");
      cancelRetestBtn.onclick = () => retestModal.classList.remove("active");
    }

    if (retestForm) {
      retestForm.onsubmit = async (e) => {
        e.preventDefault();
        const bugId = parseInt(document.getElementById("retest-bug-id-page").value);
        const passed = document.getElementById("retest-verdict-page").value === "true";
        const retest_notes = document.getElementById("retest-notes-page").value.trim();

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

    // Details Modal Events
    const detailModal = document.getElementById("modal-detail-bug-page");
    const closeDetailBtn = document.getElementById("btn-close-detail-modal-page");
    const cancelDetailBtn = document.getElementById("btn-cancel-detail-modal-page");
    if (detailModal) {
      if (closeDetailBtn) closeDetailBtn.onclick = () => detailModal.classList.remove("active");
      if (cancelDetailBtn) cancelDetailBtn.onclick = () => detailModal.classList.remove("active");
    }

    // Filter controls
    const searchInput = document.getElementById("bug-search-input");
    const filterProj = document.getElementById("bug-filter-proj");
    const filterSev = document.getElementById("bug-filter-sev");
    const filterSt = document.getElementById("bug-filter-status");

    const applyFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const projId = filterProj.value;
      const sev = filterSev.value;
      const st = filterSt.value;

      const filtered = this.bugs.filter(b => {
        const matchesQ = !q || b.bug_code.toLowerCase().includes(q) || b.title.toLowerCase().includes(q) || (b.description && b.description.toLowerCase().includes(q));
        const matchesProj = !projId || b.project_id == projId;
        const matchesSev = !sev || b.severity === sev;
        const matchesSt = !st || b.status === st;
        return matchesQ && matchesProj && matchesSev && matchesSt;
      });

      this.renderTable(filtered);
    };

    if (searchInput) searchInput.oninput = applyFilter;
    if (filterProj) filterProj.onchange = applyFilter;
    if (filterSev) filterSev.onchange = applyFilter;
    if (filterSt) filterSt.onchange = applyFilter;
  },

  async loadProjectsFilter(selectedProjId) {
    try {
      const projects = await API.projects.list();
      const select = document.getElementById("bug-filter-proj");
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
      this.bugs = await API.bugs.list(params);
      this.renderTable(this.bugs);
    } catch (err) {
      API.toast("Failed to load bugs: " + err.message, "error");
    }
  },

  renderTable(bugs) {
    const tbody = document.getElementById("bugs-table-body");
    if (!tbody) return;

    const user = API.getUser() || {};
    const role = user.role;

    if (!bugs || bugs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No defects match criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = bugs.map(b => {
      const isMyBug = user.id === b.assigned_to_id;
      const isReadyRetest = b.status === "Ready for Retesting" || b.status === "Fixed" || b.status === "Retesting";
      const isClosed = b.status === "Closed";
      const isInProgress = b.status === "In Progress";
      const isOpen = ["Open", "Assigned", "Reopened"].includes(b.status);

      return `
        <tr style="${isMyBug ? 'background-color: var(--bg-card-hover);' : ''}">
          <td>
            <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${b.title}</div>
            <div style="font-size: 11px; color: #DC2626; font-family: var(--font-mono);">${b.bug_code}</div>
          </td>
          <td style="color: var(--text-secondary); font-size: 13px;">${b.project_name}</td>
          <td><span class="badge badge-${b.severity.toLowerCase()}">${b.severity}</span></td>
          <td><span class="badge badge-${b.priority.toLowerCase()}">${b.priority}</span></td>
          <td>
            <span class="badge" style="${isReadyRetest ? 'background:#EDE9FE; color:#6D28D9;' : (isClosed ? 'background:#D1FAE5; color:#065F46;' : (b.status === 'Reopened' ? 'background:#FEE2E2; color:#991B1B;' : (isInProgress ? 'background:#FEF3C7; color:#92400E;' : 'background:#FEE2E2; color:#991B1B;')))}">
              ${b.status}
            </span>
          </td>
          <td style="font-size: 13px;">${b.assigned_to_name || 'Unassigned'}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${b.reported_by_name}</td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              ${(role === "Developer" && isOpen) ? `
                <button class="btn btn-secondary btn-sm" onclick="BugsView.startFix(${b.id})">
                  Start Fix
                </button>
              ` : ''}
              ${(role === "Developer" && isInProgress) ? `
                <button class="btn btn-primary btn-sm" onclick="BugsView.openFixModal(${b.id})">
                  Mark Fixed
                </button>
              ` : ''}
              ${(role === "Tester" && isReadyRetest) ? `
                <button class="btn btn-primary btn-sm" onclick="BugsView.openRetestModal(${b.id})">
                  Retest
                </button>
              ` : ''}
              <button class="btn btn-secondary btn-sm" onclick="BugsView.openDetailModal(${b.id})">
                Details
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  async startFix(bugId) {
    try {
      await API.bugs.startFix(bugId);
      API.toast("Bug fix started. Status: In Progress", "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  openFixModal(bugId) {
    const b = this.bugs.find(item => item.id === bugId);
    if (!b) return;

    const modal = document.getElementById("modal-fix-bug-page");
    document.getElementById("fix-bug-id-page").value = b.id;
    document.getElementById("fix-bug-code-page").textContent = b.bug_code;
    document.getElementById("fix-bug-title-page").textContent = b.title;
    document.getElementById("fix-resolution-notes-page").value = "";
    modal.classList.add("active");
  },

  openRetestModal(bugId) {
    const b = this.bugs.find(item => item.id === bugId);
    if (!b) return;

    const modal = document.getElementById("modal-retest-bug-page");
    document.getElementById("retest-bug-id-page").value = b.id;
    document.getElementById("retest-bug-code-page").textContent = b.bug_code;
    document.getElementById("retest-bug-title-page").textContent = b.title;
    document.querySelector("#retest-dev-notes-page span").textContent = b.resolution_notes || "Resolved by developer.";
    document.getElementById("retest-notes-page").value = "";
    document.getElementById("retest-verdict-page").value = "true";
    modal.classList.add("active");
  },

  openDetailModal(bugId) {
    const b = this.bugs.find(item => item.id === bugId);
    if (!b) return;

    const modal = document.getElementById("modal-detail-bug-page");
    document.getElementById("detail-bug-title-header").textContent = `[${b.bug_code}] ${b.title}`;
    const body = document.getElementById("detail-bug-body");
    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: var(--bg-secondary); padding: 12px; border-radius: 6px;">
        <div><strong>Project:</strong> ${b.project_name}</div>
        <div><strong>Status:</strong> ${b.status}</div>
        <div><strong>Severity:</strong> ${b.severity}</div>
        <div><strong>Priority:</strong> ${b.priority}</div>
        <div><strong>Assigned To:</strong> ${b.assigned_to_name || 'Unassigned'}</div>
        <div><strong>Reported By:</strong> ${b.reported_by_name}</div>
      </div>
      <div>
        <strong>Reproduction Steps / Description:</strong>
        <p style="margin-top: 4px; line-height: 1.5; color: var(--text-secondary); white-space: pre-wrap;">${b.description}</p>
      </div>
      ${b.resolution_notes ? `
        <div style="background: var(--brand-forest-pale); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
          <strong style="color: var(--brand-forest);">Developer Resolution Notes:</strong>
          <p style="margin-top: 4px; line-height: 1.5; color: var(--brand-charcoal); white-space: pre-wrap;">${b.resolution_notes}</p>
        </div>
      ` : ''}
    `;
    modal.classList.add("active");
  }
};
