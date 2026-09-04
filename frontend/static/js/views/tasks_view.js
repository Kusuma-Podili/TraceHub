// Tasks Management & Kanban Board View

const TasksView = {
  tasks: [],

  async render(container, params = {}) {
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Sprint Engineering Tasks & Kanban</h1>
          <p class="page-subtitle">Track granular engineering deliverables, code reviews, and workflow transitions</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-tasks">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-create-task">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> New Task
          </button>
        </div>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 16px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 220px;">
            <input type="text" id="task-search-input" class="form-control" placeholder="Search tasks by title or code..." />
          </div>
          <div style="width: 200px;">
            <select id="task-filter-project" class="form-control">
              <option value="">All Projects</option>
            </select>
          </div>
          <div style="width: 150px;">
            <select id="task-filter-priority" class="form-control">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style="width: 170px;">
            <select id="task-filter-phase" class="form-control">
              <option value="">All Phases</option>
              <option value="Requirement Analysis">Requirement Analysis</option>
              <option value="Planning">Planning</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Deployment">Deployment</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <!-- KANBAN BOARD -->
      <div class="kanban-board">
        <!-- Column 1: To Do -->
        <div class="kanban-col" data-status="To Do" ondragover="event.preventDefault()" ondrop="TasksView.handleDrop(event, 'To Do')">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#94A3B8;"></span>
              To Do
            </div>
            <span class="kanban-counter" id="count-todo">0</span>
          </div>
          <div class="kanban-cards-container" id="kanban-col-todo"></div>
        </div>

        <!-- Column 2: In Progress -->
        <div class="kanban-col" data-status="In Progress" ondragover="event.preventDefault()" ondrop="TasksView.handleDrop(event, 'In Progress')">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#F59E0B;"></span>
              In Progress
            </div>
            <span class="kanban-counter" id="count-in-progress">0</span>
          </div>
          <div class="kanban-cards-container" id="kanban-col-in-progress"></div>
        </div>

        <!-- Column 3: Ready for Testing / Testing -->
        <div class="kanban-col" data-status="Ready for Testing" ondragover="event.preventDefault()" ondrop="TasksView.handleDrop(event, 'Ready for Testing')">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#8B5CF6;"></span>
              Testing / QA
            </div>
            <span class="kanban-counter" id="count-review">0</span>
          </div>
          <div class="kanban-cards-container" id="kanban-col-review"></div>
        </div>

        <!-- Column 4: Completed -->
        <div class="kanban-col" data-status="Completed" ondragover="event.preventDefault()" ondrop="TasksView.handleDrop(event, 'Completed')">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
              Completed
            </div>
            <span class="kanban-counter" id="count-completed">0</span>
          </div>
          <div class="kanban-cards-container" id="kanban-col-completed"></div>
        </div>
      </div>

      <!-- Create / Edit Task Modal -->
      <div id="modal-task" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-task-title">Create Development Task</h3>
            <button class="modal-close" id="btn-close-task-modal">&times;</button>
          </div>
          <form id="form-task">
            <input type="hidden" id="task-edit-id" />
            <div class="modal-body">
              <div class="form-group" id="group-task-project">
                <label class="form-label">Project</label>
                <select id="task-form-project" class="form-control" required>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Task Title</label>
                <input type="text" id="task-form-title" class="form-control" placeholder="e.g. Implement WebRTC DataChannel buffer" required />
              </div>
              <div class="form-group">
                <label class="form-label">Task Description</label>
                <textarea id="task-form-desc" class="form-control" placeholder="Detailed technical scope, API endpoints, pull request requirements..."></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">SDLC Phase</label>
                  <select id="task-form-phase" class="form-control">
                    <option value="Requirement Analysis">Requirement Analysis</option>
                    <option value="Planning">Planning</option>
                    <option value="Design">Design</option>
                    <option value="Development" selected>Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="task-form-priority" class="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Assign To</label>
                  <select id="task-form-assigned" class="form-control">
                    <option value="">-- Unassigned --</option>
                    <!-- Populated dynamically -->
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Due Date</label>
                  <input type="date" id="task-form-due" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-task-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-task">Save Task</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Fail Testing & Log Defect Modal for Kanban -->
      <div id="modal-fail-task-kanban" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" style="color: #991B1B;">Fail Task QA & Report Defect</h3>
            <button class="modal-close" id="btn-close-fail-kanban">&times;</button>
          </div>
          <form id="form-fail-task-kanban">
            <input type="hidden" id="fail-kanban-task-id" />
            <div class="modal-body">
              <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13px; margin-bottom: 12px;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="fail-kanban-task-code">TASK-001</span>
                <div style="font-weight: 600; margin-top: 4px;" id="fail-kanban-task-title">Task Title</div>
              </div>
              <div class="form-group">
                <label class="form-label">Defect Title</label>
                <input type="text" id="fail-kanban-bug-title" class="form-control" placeholder="e.g. Acceptance test failure: 500 error on checkout submission" required />
              </div>
              <div class="form-group">
                <label class="form-label">Defect Description / Reproduction Steps</label>
                <textarea id="fail-kanban-bug-desc" class="form-control" placeholder="1. Set up test state... 2. Run action... 3. Expected vs Actual..." required rows="4"></textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Severity</label>
                  <select id="fail-kanban-bug-severity" class="form-control">
                    <option value="Critical">Critical</option>
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="fail-kanban-bug-priority" class="form-control">
                    <option value="Critical">Critical</option>
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <span style="font-size: 11.5px; color: var(--text-muted);">
                Failing this test will transition the task back to <strong>In Progress</strong> and assign the defect directly to the developer.
              </span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-fail-kanban">Cancel</button>
              <button type="submit" class="btn btn-primary" style="background-color: #E11D48; border-color: #E11D48;">Fail Task & File Bug</button>
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
    const refreshBtn = document.getElementById("btn-refresh-tasks");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    // Modal
    const modal = document.getElementById("modal-task");
    const openBtn = document.getElementById("btn-create-task");
    const closeBtn = document.getElementById("btn-close-task-modal");
    const cancelBtn = document.getElementById("btn-cancel-task-modal");
    const form = document.getElementById("form-task");

    if (openBtn && modal) {
      openBtn.onclick = async () => {
        document.getElementById("modal-task-title").textContent = "Create Development Task";
        document.getElementById("task-edit-id").value = "";
        form.reset();
        document.getElementById("group-task-project").style.display = "block";
        modal.classList.add("active");
        await this.populateFormSelects();
      };

      closeBtn.onclick = () => modal.classList.remove("active");
      cancelBtn.onclick = () => modal.classList.remove("active");
    }

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const editId = document.getElementById("task-edit-id").value;
        const title = document.getElementById("task-form-title").value.trim();
        const description = document.getElementById("task-form-desc").value.trim();
        const phase_name = document.getElementById("task-form-phase").value;
        const priority = document.getElementById("task-form-priority").value;
        const assignedVal = document.getElementById("task-form-assigned").value;
        const assigned_to_id = assignedVal ? parseInt(assignedVal) : null;
        const due_date_raw = document.getElementById("task-form-due").value;
        const due_date = due_date_raw ? new Date(due_date_raw).toISOString() : null;

        try {
          if (editId) {
            await API.tasks.update(editId, { title, description, phase_name, priority, assigned_to_id, due_date });
            API.toast("Task updated successfully!", "success");
          } else {
            const project_id = parseInt(document.getElementById("task-form-project").value);
            await API.tasks.create({ project_id, title, description, phase_name, priority, assigned_to_id, due_date });
            API.toast("Task created successfully!", "success");
          }
          modal.classList.remove("active");
          form.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Fail Task Modal for Kanban
    const failKanbanModal = document.getElementById("modal-fail-task-kanban");
    const closeFailKanban = document.getElementById("btn-close-fail-kanban");
    const cancelFailKanban = document.getElementById("btn-cancel-fail-kanban");
    const failKanbanForm = document.getElementById("form-fail-task-kanban");

    if (closeFailKanban && failKanbanModal) {
      closeFailKanban.onclick = () => failKanbanModal.classList.remove("active");
      cancelFailKanban.onclick = () => failKanbanModal.classList.remove("active");
    }

    if (failKanbanForm) {
      failKanbanForm.onsubmit = async (e) => {
        e.preventDefault();
        const taskId = parseInt(document.getElementById("fail-kanban-task-id").value);
        const title = document.getElementById("fail-kanban-bug-title").value.trim();
        const description = document.getElementById("fail-kanban-bug-desc").value.trim();
        const severity = document.getElementById("fail-kanban-bug-severity").value;
        const priority = document.getElementById("fail-kanban-bug-priority").value;

        try {
          const res = await API.tasks.failTesting(taskId, {
            bug_title: title,
            bug_description: description,
            bug_severity: severity,
            bug_priority: priority
          });
          API.toast(`Task QA failed. Defect '${res.bug ? res.bug.bug_code : 'Reported'}' filed and returned to developer.`, "warning");
          failKanbanModal.classList.remove("active");
          failKanbanForm.reset();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }

    // Filter controls
    const searchInput = document.getElementById("task-search-input");
    const filterProj = document.getElementById("task-filter-project");
    const filterPri = document.getElementById("task-filter-priority");
    const filterPh = document.getElementById("task-filter-phase");

    const applyFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const projId = filterProj.value;
      const pri = filterPri.value;
      const ph = filterPh.value;

      const filtered = this.tasks.filter(t => {
        const matchesQ = !q || t.task_code.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
        const matchesProj = !projId || t.project_id == projId;
        const matchesPri = !pri || t.priority === pri;
        const matchesPh = !ph || t.phase_name === ph;
        return matchesQ && matchesProj && matchesPri && matchesPh;
      });

      this.renderKanbanColumns(filtered);
    };

    if (searchInput) searchInput.oninput = applyFilter;
    if (filterProj) filterProj.onchange = applyFilter;
    if (filterPri) filterPri.onchange = applyFilter;
    if (filterPh) filterPh.onchange = applyFilter;
  },

  async loadProjectsFilter(selectedProjId) {
    try {
      const projects = await API.projects.list();
      const select = document.getElementById("task-filter-project");
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
      const projSelect = document.getElementById("task-form-project");
      projSelect.innerHTML = projects.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

      const users = await API.auth.getUsers();
      const userSelect = document.getElementById("task-form-assigned");
      userSelect.innerHTML = `<option value="">-- Unassigned --</option>` + users.map(u => `<option value="${u.id}">${u.full_name} (${u.role})</option>`).join('');
    } catch (err) {
      console.error(err);
    }
  },

  async loadData(projectId = null) {
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      this.tasks = await API.tasks.list(params);
      this.renderKanbanColumns(this.tasks);
    } catch (err) {
      API.toast("Failed to load tasks: " + err.message, "error");
    }
  },

  renderKanbanColumns(tasks) {
    const cols = {
      "To Do": document.getElementById("kanban-col-todo"),
      "In Progress": document.getElementById("kanban-col-in-progress"),
      "Testing": document.getElementById("kanban-col-review"),
      "Completed": document.getElementById("kanban-col-completed"),
    };

    const counts = {
      "To Do": 0,
      "In Progress": 0,
      "Testing": 0,
      "Completed": 0
    };

    Object.values(cols).forEach(c => { if (c) c.innerHTML = ""; });

    const user = API.getUser() || {};
    const isDev = user.role === "Developer";
    const isTester = user.role === "Tester";

    tasks.forEach(t => {
      let targetColKey = t.status;
      if (["Ready for Testing", "Testing", "Review"].includes(t.status)) {
        targetColKey = "Testing";
      }

      const colEl = cols[targetColKey];
      if (!colEl) return;
      counts[targetColKey]++;

      const card = document.createElement("div");
      card.className = "kanban-card";
      card.draggable = true;
      card.setAttribute("data-id", t.id);
      card.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", t.id);
      };

      const isAssignedToMe = user.id === t.assigned_to_id;
      const isReadyForTesting = t.status === "Ready for Testing";
      const isInTesting = t.status === "Testing";

      let statusBadge = `<span class="badge badge-${t.status === 'Completed' ? 'completed' : (t.status === 'In Progress' ? 'inprogress' : 'todo')}">${t.status}</span>`;
      if (isReadyForTesting) statusBadge = `<span class="badge" style="background:#EDE9FE; color:#6D28D9;">Ready for Testing</span>`;
      else if (isInTesting) statusBadge = `<span class="badge" style="background:#DBEAFE; color:#1D4ED8;">In Testing</span>`;

      card.innerHTML = `
        <div class="kanban-card-top">
          <span class="kanban-task-code">${t.task_code}</span>
          <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
        </div>
        <div class="kanban-card-title">${t.title}</div>
        <div style="font-size: 11.5px; color: var(--brand-forest); font-weight: 500; display: flex; justify-content: space-between; align-items: center;">
          <span>Phase: ${t.phase_name}</span>
          <span>${t.progress_percent}%</span>
        </div>
        <div class="kanban-card-footer">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background: var(--brand-forest-light); color: #FFF; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700;">
              ${t.assigned_to_name ? t.assigned_to_name.charAt(0) : '?'}
            </div>
            <span style="color: var(--text-secondary); font-size: 11px;">${t.assigned_to_name || 'Unassigned'}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 4px;">
            ${statusBadge}
          </div>
        </div>

        <div style="display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end;">
          ${(isDev && isAssignedToMe && t.status === 'To Do') ? `
            <button class="btn btn-primary btn-sm" style="font-size: 11px; padding: 4px 8px;" onclick="TasksView.startDevelopment(${t.id})">
              Start Dev
            </button>
          ` : ''}

          ${(isDev && isAssignedToMe && t.status === 'In Progress') ? `
            <button class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 4px 8px;" onclick="TasksView.promptUpdateProgress(${t.id}, ${t.progress_percent})">
              ${t.progress_percent}% ✎
            </button>
            <button class="btn btn-primary btn-sm" style="font-size: 11px; padding: 4px 8px;" onclick="TasksView.submitForQA(${t.id})">
              Submit for Testing →
            </button>
          ` : ''}

          ${(isTester && isReadyForTesting) ? `
            <button class="btn btn-primary btn-sm" style="font-size: 11px; padding: 4px 8px;" onclick="TasksView.startTesting(${t.id})">
              Start Testing
            </button>
          ` : ''}

          ${(isTester && isInTesting) ? `
            <button class="btn btn-primary btn-sm" style="font-size: 11px; padding: 4px 8px; background: #10B981; border-color: #10B981;" onclick="TasksView.passTesting(${t.id})">
              Pass
            </button>
            <button class="btn btn-primary btn-sm" style="font-size: 11px; padding: 4px 8px; background: #E11D48; border-color: #E11D48;" onclick="TasksView.openFailTestingModal(${t.id})">
              Fail
            </button>
          ` : ''}
        </div>
      `;

      colEl.appendChild(card);
    });

    document.getElementById("count-todo").textContent = counts["To Do"];
    document.getElementById("count-in-progress").textContent = counts["In Progress"];
    document.getElementById("count-review").textContent = counts["Testing"];
    document.getElementById("count-completed").textContent = counts["Completed"];
  },

  async handleDrop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) return;

    if (newStatus === "Completed") {
      API.toast("Tasks cannot be moved to Completed directly! They must be submitted for QA testing and passed by a Tester.", "warning");
      return;
    }

    await this.changeStatus(parseInt(taskId), newStatus);
  },

  async changeStatus(taskId, newStatus) {
    try {
      await API.tasks.updateStatus(taskId, newStatus);
      API.toast(`Task moved to '${newStatus}'`, "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async startDevelopment(taskId) {
    try {
      await API.tasks.startDevelopment(taskId);
      API.toast("Task moved to 'In Progress'.", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async submitForQA(taskId) {
    if (!confirm("Are you sure development is complete? This will hand off the task to QA Testers.")) return;
    try {
      await API.tasks.submitForTesting(taskId);
      API.toast("Task submitted for QA testing!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async startTesting(taskId) {
    try {
      await API.tasks.startTesting(taskId);
      API.toast("Testing started on task.", "info");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async passTesting(taskId) {
    if (!confirm("Confirm test execution PASSED? This will mark task as Completed.")) return;
    try {
      await API.tasks.passTesting(taskId);
      API.toast("Task successfully PASSED testing and is now Completed!", "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async promptUpdateProgress(taskId, currentPct) {
    const val = prompt(`Update task completion progress (0 - 100%):`, currentPct);
    if (val === null) return;
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 100) {
      API.toast("Please enter a valid percentage between 0 and 100.", "warning");
      return;
    }
    try {
      await API.tasks.updateProgress(taskId, num);
      API.toast(`Progress updated to ${num}%`, "success");
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  openFailTestingModal(taskId) {
    const t = this.tasks.find(item => item.id === taskId);
    if (!t) return;

    const modal = document.getElementById("modal-fail-task-kanban");
    document.getElementById("fail-kanban-task-id").value = t.id;
    document.getElementById("fail-kanban-task-code").textContent = t.task_code;
    document.getElementById("fail-kanban-task-title").textContent = t.title;
    document.getElementById("fail-kanban-bug-title").value = `QA Failure on [${t.task_code}] ${t.title}`;
    document.getElementById("fail-kanban-bug-desc").value = "";
    modal.classList.add("active");
  }
};
