// Developer Workspace View

const DevDashboardView = {
  currentTab: "all",
  activeTasks: [],
  assignedBugs: [],

  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Development Workspace</h1>
          <p class="page-subtitle">Sprint execution backlog, code deliverables, defect patching, and QA handoffs</p>
        </div>
        <button class="btn btn-secondary" id="btn-refresh-dev">
          <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
        </button>
      </div>

      <!-- Developer Metrics Grid -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <span class="metric-label">In Development</span>
          <span class="metric-value" id="dev-active-tasks-count" style="color: #D97706;">-</span>
          <span class="metric-sub">Work in progress</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Ready for QA</span>
          <span class="metric-value" id="dev-ready-qa-count" style="color: #8B5CF6;">-</span>
          <span class="metric-sub">Awaiting test execution</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">In Testing</span>
          <span class="metric-value" id="dev-in-testing-count" style="color: #3B82F6;">-</span>
          <span class="metric-sub">QA currently validating</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Verified Completed</span>
          <span class="metric-value" id="dev-completed-tasks-count" style="color: #10B981;">-</span>
          <span class="metric-sub">Passed QA verification</span>
        </div>
        <div class="metric-card" style="border-top: 3px solid #E11D48;">
          <span class="metric-label">Assigned Defects</span>
          <span class="metric-value" id="dev-assigned-bugs-count" style="color: #E11D48;">-</span>
          <span class="metric-sub" id="dev-retest-bugs-sub">0 ready for retest</span>
        </div>
      </div>

      <!-- Two-Column Workspace Layout -->
      <div style="display: grid; grid-template-columns: 2fr 1.3fr; gap: 24px; align-items: flex-start;">
        <!-- Left Column: Assigned Development Tasks -->
        <div>
          <div class="card">
            <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 class="card-title">Assigned Development Tasks</h3>
                <span style="font-size: 12px; color: var(--text-muted);">Tasks assigned to your engineering queue</span>
              </div>
              <div style="display: flex; gap: 6px;" id="dev-task-tabs">
                <button class="btn btn-sm btn-primary tab-filter active" data-filter="all">All</button>
                <button class="btn btn-sm btn-secondary tab-filter" data-filter="To Do">To Do</button>
                <button class="btn btn-sm btn-secondary tab-filter" data-filter="In Progress">In Progress</button>
                <button class="btn btn-sm btn-secondary tab-filter" data-filter="Ready for Testing">Ready for QA</button>
                <button class="btn btn-sm btn-secondary tab-filter" data-filter="Completed">Completed</button>
              </div>
            </div>
            <div class="card-body" id="dev-tasks-container" style="display: flex; flex-direction: column; gap: 16px; padding: 18px;">
              <div style="text-align: center; color: var(--text-muted); padding: 32px;">Loading assigned engineering tasks...</div>
            </div>
          </div>
        </div>

        <!-- Right Column: Defect Fix Queue & Guidelines -->
        <div>
          <!-- Assigned Defects Queue -->
          <div class="card" style="border-top: 3px solid #E11D48;">
            <div class="card-header">
              <div>
                <h3 class="card-title" style="color: #991B1B;">Assigned Defect Fix Queue</h3>
                <span style="font-size: 11.5px; color: var(--text-muted);">Reported bugs requiring code patches</span>
              </div>
              <span class="badge badge-critical" id="dev-bugs-badge">0 Open</span>
            </div>
            <div class="card-body" id="dev-bugs-container" style="display: flex; flex-direction: column; gap: 14px; padding: 16px;">
              <div style="text-align: center; color: var(--text-muted); padding: 20px;">No open defects assigned! Great job.</div>
            </div>
          </div>

          <!-- Workflow Rules Reference Card -->
          <div class="card" style="background: var(--bg-card);">
            <div class="card-header">
              <h3 class="card-title" style="font-size: 13.5px;">Developer SDLC Rules</h3>
            </div>
            <div class="card-body" style="padding: 14px; font-size: 12.5px; color: var(--text-secondary); line-height: 1.6;">
              <ul style="padding-left: 18px; margin: 0;">
                <li><strong>Start Development:</strong> Moves task to <em>In Progress</em>.</li>
                <li><strong>Update Progress:</strong> Track increments (0-100%) and save work.</li>
                <li><strong>Submit for Testing:</strong> Hands off task to QA. Progress must be &gt;0%.</li>
                <li><strong>QA Approval Gate:</strong> Developers cannot mark tasks <em>Completed</em> directly. Only QA passing tests completes tasks.</li>
                <li><strong>Defect Lifecycle:</strong> Start fix &rarr; Mark as Fixed with notes &rarr; QA retests and closes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Mark Bug Fixed Modal -->
      <div id="modal-fix-bug" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Mark Bug as Fixed & Queue for Retest</h3>
            <button class="modal-close" id="btn-close-fix-modal">&times;</button>
          </div>
          <form id="form-submit-bug-fix">
            <input type="hidden" id="fix-bug-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13px; margin-bottom: 14px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: #DC2626; font-weight: 700;" id="fix-bug-code">BUG-001</span>
                <div style="font-weight: 600; margin-top: 4px;" id="fix-bug-title">Defect Title</div>
              </div>
              <div class="form-group">
                <label class="form-label">Resolution Notes & Commit References</label>
                <textarea id="fix-resolution-notes" class="form-control" placeholder="Describe root cause fix, PR link, and verified patches..." required rows="4"></textarea>
                <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
                  This moves the defect to <strong>Ready for Retesting</strong>. QA will verify the fix before closing.
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-fix-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Mark as Fixed</button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Task Bugs Modal -->
      <div id="modal-task-bugs" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="task-bugs-modal-title">Linked Defects</h3>
            <button class="modal-close" id="btn-close-task-bugs-modal">&times;</button>
          </div>
          <div class="modal-body" id="task-bugs-modal-body" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto;">
            <!-- Rendered dynamically -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-close-task-bugs-btn">Close</button>
          </div>
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
    const refreshBtn = document.getElementById("btn-refresh-dev");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Tab Filters
    const tabContainer = document.getElementById("dev-task-tabs");
    if (tabContainer) {
      tabContainer.querySelectorAll(".tab-filter").forEach(btn => {
        btn.onclick = () => {
          tabContainer.querySelectorAll(".tab-filter").forEach(b => {
            b.classList.remove("btn-primary", "active");
            b.classList.add("btn-secondary");
          });
          btn.classList.remove("btn-secondary");
          btn.classList.add("btn-primary", "active");
          this.currentTab = btn.getAttribute("data-filter");
          this.renderTasksList();
        };
      });
    }

    // Fix Bug Modal
    const fixModal = document.getElementById("modal-fix-bug");
    const closeFixBtn = document.getElementById("btn-close-fix-modal");
    const cancelFixBtn = document.getElementById("btn-cancel-fix-modal");
    const fixForm = document.getElementById("form-submit-bug-fix");

    if (closeFixBtn && fixModal) {
      closeFixBtn.onclick = () => fixModal.classList.remove("active");
      cancelFixBtn.onclick = () => fixModal.classList.remove("active");
    }

    if (fixForm) {
      fixForm.onsubmit = async (e) => {
        e.preventDefault();
        const bugId = document.getElementById("fix-bug-id").value;
        const notes = document.getElementById("fix-resolution-notes").value.trim();

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

    // Task Bugs Modal
    const bugsModal = document.getElementById("modal-task-bugs");
    const closeBugsBtn = document.getElementById("btn-close-task-bugs-modal");
    const closeBugsBtn2 = document.getElementById("btn-close-task-bugs-btn");
    if (bugsModal) {
      if (closeBugsBtn) closeBugsBtn.onclick = () => bugsModal.classList.remove("active");
      if (closeBugsBtn2) closeBugsBtn2.onclick = () => bugsModal.classList.remove("active");
    }
  },

  async loadData() {
    try {
      const data = await API.reports.devDashboard();

      // Store local lists
      this.activeTasks = data.active_tasks || [];
      this.assignedBugs = data.assigned_bugs || [];

      // Calculate counts
      const inDev = this.activeTasks.filter(t => t.status === "In Progress").length;
      const readyQA = this.activeTasks.filter(t => t.status === "Ready for Testing").length;
      const inTest = this.activeTasks.filter(t => t.status === "Testing").length;
      const completed = this.activeTasks.filter(t => t.status === "Completed").length;

      const openBugs = this.assignedBugs.filter(b => ["Open", "Assigned", "In Progress", "Reopened"].includes(b.status)).length;
      const readyRetest = this.assignedBugs.filter(b => b.status === "Ready for Retesting").length;

      // Update Metric Cards
      document.getElementById("dev-active-tasks-count").textContent = inDev;
      document.getElementById("dev-ready-qa-count").textContent = readyQA;
      document.getElementById("dev-in-testing-count").textContent = inTest;
      document.getElementById("dev-completed-tasks-count").textContent = completed;

      document.getElementById("dev-assigned-bugs-count").textContent = openBugs;
      document.getElementById("dev-retest-bugs-sub").textContent = `${readyRetest} ready for retest`;
      document.getElementById("dev-bugs-badge").textContent = `${openBugs} Open`;

      // Render Task List and Bug Queue
      this.renderTasksList();
      this.renderBugsQueue();
    } catch (err) {
      API.toast("Error loading developer workspace: " + err.message, "error");
    }
  },

  renderTasksList() {
    const container = document.getElementById("dev-tasks-container");
    if (!container) return;

    let filtered = this.activeTasks;
    if (this.currentTab !== "all") {
      filtered = this.activeTasks.filter(t => t.status === this.currentTab);
    }

    if (!filtered || filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 36px;">
          No tasks found in filter <strong>"${this.currentTab}"</strong>.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isToDo = t.status === "To Do";
      const isInProgress = t.status === "In Progress";
      const isReadyTesting = t.status === "Ready for Testing";
      const isTesting = t.status === "Testing";
      const isCompleted = t.status === "Completed";

      let statusBadge = `<span class="badge badge-todo">${t.status}</span>`;
      if (isInProgress) statusBadge = `<span class="badge badge-inprogress">In Progress</span>`;
      else if (isReadyTesting) statusBadge = `<span class="badge" style="background:#EDE9FE; color:#6D28D9;">Ready for Testing</span>`;
      else if (isTesting) statusBadge = `<span class="badge" style="background:#DBEAFE; color:#1D4ED8;">In Testing</span>`;
      else if (isCompleted) statusBadge = `<span class="badge badge-completed">Completed</span>`;

      const bugsCount = t.bugs_count || (t.bugs ? t.bugs.length : 0);
      const openBugsCount = t.open_bugs_count || 0;

      return `
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--brand-forest); background: var(--brand-forest-pale); padding: 2px 6px; border-radius: 4px;">
                ${t.task_code}
              </span>
              <span style="font-size: 12px; color: var(--text-muted);">${t.project_name || 'Project'} · Phase: <strong>${t.phase_name}</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
              ${statusBadge}
            </div>
          </div>

          <div>
            <h4 style="font-size: 15px; font-weight: 600; color: var(--brand-charcoal); margin-bottom: 4px;">${t.title}</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.45;">${t.description || 'No detailed task instructions provided.'}</p>
          </div>

          <!-- Progress Bar & Interactive Slider for In Progress tasks -->
          <div style="background: var(--bg-secondary); border-radius: 6px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <span style="color: var(--text-secondary);">Task Completion Progress</span>
              <span style="color: var(--brand-charcoal); font-weight: 700;" id="task-pct-label-${t.id}">${t.progress_percent}%</span>
            </div>
            <div class="progress-container" style="height: 8px; margin-bottom: 10px;">
              <div class="progress-fill" id="task-progress-fill-${t.id}" style="width: ${t.progress_percent}%;"></div>
            </div>

            ${isInProgress ? `
              <div style="display: flex; align-items: center; gap: 10px;">
                <input type="range" min="0" max="100" value="${t.progress_percent}" id="task-range-${t.id}"
                  style="flex: 1; accent-color: var(--brand-forest);"
                  oninput="DevDashboardView.handleRangeInput(${t.id}, this.value)" />
                <button class="btn btn-secondary btn-sm" onclick="DevDashboardView.saveTaskProgress(${t.id})">
                  Save Progress
                </button>
              </div>
            ` : ''}
          </div>

          <!-- Actions Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
            <div>
              ${bugsCount > 0 ? `
                <button class="btn btn-secondary btn-sm" style="font-size: 11.5px; color: ${openBugsCount > 0 ? '#DC2626' : 'var(--text-secondary)'};" onclick="DevDashboardView.openTaskBugsModal(${t.id})">
                  <i data-lucide="bug" style="width: 13px; height: 13px;"></i>
                  ${openBugsCount} Open Defect${openBugsCount !== 1 ? 's' : ''} (${bugsCount} Total)
                </button>
              ` : `
                <span style="font-size: 11.5px; color: var(--text-muted);">No defects logged</span>
              `}
            </div>

            <div style="display: flex; gap: 8px;">
              ${isToDo ? `
                <button class="btn btn-primary btn-sm" onclick="DevDashboardView.startDevelopment(${t.id})">
                  <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start Development
                </button>
              ` : ''}

              ${isInProgress ? `
                <button class="btn btn-primary btn-sm" onclick="DevDashboardView.submitTaskForQA(${t.id}, ${t.progress_percent})">
                  <i data-lucide="send" style="width: 14px; height: 14px;"></i> Submit for Testing
                </button>
              ` : ''}

              ${isReadyTesting ? `
                <span style="font-size: 12px; color: #6D28D9; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;">
                  <i data-lucide="clock" style="width: 14px; height: 14px;"></i> Awaiting QA Validation
                </span>
              ` : ''}

              ${isTesting ? `
                <span style="font-size: 12px; color: #1D4ED8; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;">
                  <i data-lucide="play-circle" style="width: 14px; height: 14px;"></i> QA Currently Testing
                </span>
              ` : ''}

              ${isCompleted ? `
                <span style="font-size: 12px; color: #065F46; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                  <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Verified & Passed by QA
                </span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  handleRangeInput(taskId, val) {
    const label = document.getElementById(`task-pct-label-${taskId}`);
    const fill = document.getElementById(`task-progress-fill-${taskId}`);
    if (label) label.textContent = `${val}%`;
    if (fill) fill.style.width = `${val}%`;
  },

  async saveTaskProgress(taskId) {
    const range = document.getElementById(`task-range-${taskId}`);
    if (!range) return;
    const newPct = parseFloat(range.value);

    try {
      await API.tasks.updateProgress(taskId, newPct);
      API.toast(`Progress updated to ${newPct}%`, "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async startDevelopment(taskId) {
    try {
      await API.tasks.startDevelopment(taskId);
      API.toast("Task moved to 'In Progress'. Happy coding!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async submitTaskForQA(taskId, currentPct) {
    if (currentPct <= 0) {
      API.toast("Cannot submit task for testing with 0% progress! Work on the task first.", "warning");
      return;
    }
    if (!confirm("Submit this task to QA Testers for validation? Make sure code deliverables are ready.")) {
      return;
    }

    try {
      await API.tasks.submitForTesting(taskId);
      API.toast("Task submitted for QA testing!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  renderBugsQueue() {
    const container = document.getElementById("dev-bugs-container");
    if (!container) return;

    if (!this.assignedBugs || this.assignedBugs.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">Zero open bugs assigned to you!</div>`;
      return;
    }

    container.innerHTML = this.assignedBugs.map(b => {
      const isOpen = ["Open", "Assigned", "Reopened"].includes(b.status);
      const isInProgress = b.status === "In Progress";
      const isReadyRetest = b.status === "Ready for Retesting";
      const isClosed = b.status === "Closed";

      return `
        <div style="background: #FFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 11px; color: #DC2626; font-weight: 700;">${b.bug_code}</span>
            <div style="display: flex; gap: 6px;">
              <span class="badge badge-${b.severity.toLowerCase()}">${b.severity}</span>
              <span class="badge" style="${isReadyRetest ? 'background:#EDE9FE; color:#6D28D9;' : (isClosed ? 'background:#D1FAE5; color:#065F46;' : (isInProgress ? 'background:#FEF3C7; color:#92400E;' : 'background:#FEE2E2; color:#991B1B;'))}">
                ${b.status}
              </span>
            </div>
          </div>

          <div style="font-weight: 600; font-size: 13.5px; color: var(--brand-charcoal);">${b.title}</div>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.4;">${b.description}</p>

          ${b.task_id ? `
            <div style="font-size: 11px; color: var(--brand-forest); font-weight: 500;">
              Linked Task ID: #${b.task_id}
            </div>
          ` : ''}

          ${b.resolution_notes ? `
            <div style="padding: 6px 10px; background: var(--bg-secondary); border-radius: 4px; font-size: 11.5px; color: var(--text-secondary);">
              <strong>Patch Notes:</strong> ${b.resolution_notes}
            </div>
          ` : ''}

          <div style="display: flex; justify-content: flex-end; margin-top: 6px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
            ${isOpen ? `
              <button class="btn btn-secondary btn-sm" onclick="DevDashboardView.startBugFix(${b.id})">
                <i data-lucide="play" style="width: 13px; height: 13px;"></i> Start Fix
              </button>
            ` : ''}

            ${isInProgress ? `
              <button class="btn btn-primary btn-sm" onclick="DevDashboardView.openFixModal(${b.id})">
                <i data-lucide="check-circle" style="width: 13px; height: 13px;"></i> Mark as Fixed
              </button>
            ` : ''}

            ${isReadyRetest ? `
              <span style="font-size: 11.5px; color: #6D28D9; font-weight: 500;">
                <i data-lucide="clock" style="width: 12px; height: 12px;"></i> Awaiting QA Retest
              </span>
            ` : ''}

            ${isClosed ? `
              <span style="font-size: 11.5px; color: #065F46; font-weight: 600;">
                <i data-lucide="check" style="width: 12px; height: 12px;"></i> Verified & Closed
              </span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async startBugFix(bugId) {
    try {
      await API.bugs.startFix(bugId);
      API.toast("Bug fix started (status: In Progress)", "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  openFixModal(bugId) {
    const b = this.assignedBugs.find(item => item.id === bugId);
    if (!b) return;

    const modal = document.getElementById("modal-fix-bug");
    document.getElementById("fix-bug-id").value = b.id;
    document.getElementById("fix-bug-code").textContent = b.bug_code;
    document.getElementById("fix-bug-title").textContent = b.title;
    document.getElementById("fix-resolution-notes").value = "";
    modal.classList.add("active");
  },

  openTaskBugsModal(taskId) {
    const task = this.activeTasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById("modal-task-bugs");
    document.getElementById("task-bugs-modal-title").textContent = `Defects for Task ${task.task_code}`;
    const body = document.getElementById("task-bugs-modal-body");

    const bugs = task.bugs || [];
    if (bugs.length === 0) {
      body.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px;">No defects recorded for this task.</div>`;
    } else {
      body.innerHTML = bugs.map(b => `
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 13px; color: var(--brand-charcoal);">${b.title}</strong>
            <span class="badge badge-${b.severity ? b.severity.toLowerCase() : 'low'}">${b.status}</span>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 6px 0 0 0;">${b.description || ''}</p>
        </div>
      `).join('');
    }

    modal.classList.add("active");
  }
};

