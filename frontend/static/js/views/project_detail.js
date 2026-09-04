// Dedicated Project Details Hub with SDLC Phase Stepper & Gate Validation

const ProjectDetailView = {
  project: null,
  activeTab: "sdlc-stepper",

  async render(container, params = {}) {
    const projectId = params.id;
    if (!projectId) {
      window.App.navigate("projects");
      return;
    }

    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted);">
        Loading project details hub...
      </div>
    `;

    try {
      this.project = await API.projects.get(projectId);
      try {
        this.readiness = await API.phases.getReadiness(projectId);
      } catch (e) {
        this.readiness = null;
      }
      this.renderHub(container);
    } catch (err) {
      container.innerHTML = `
        <div class="card" style="padding: 32px; text-align: center;">
          <h3 style="color: #DC2626;">Failed to load project</h3>
          <p style="color: var(--text-secondary); margin: 8px 0 16px 0;">${err.message}</p>
          <button class="btn btn-secondary" onclick="window.App.navigate('projects')">Back to Projects</button>
        </div>
      `;
    }
  },

  renderHub(container) {
    const p = this.project;
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";

    const phases = p.phases || [];
    const currentIdx = phases.findIndex(ph => ph.phase_name === p.current_phase);
    const nextPhase = (currentIdx >= 0 && currentIdx < phases.length - 1) ? phases[currentIdx + 1].phase_name : null;

    container.innerHTML = `
      <!-- Breadcrumb & Top Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text-muted);">
          <a href="javascript:void(0)" onclick="window.App.navigate('projects')" style="color: var(--text-muted); text-decoration: none;">Projects</a>
          <span>/</span>
          <span style="color: var(--brand-charcoal); font-weight: 600;">${p.code}</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="ProjectDetailView.refreshData()">
            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> Refresh
          </button>
          ${isPM && nextPhase ? `
            <button class="btn btn-primary btn-sm" id="btn-advance-phase">
              <i data-lucide="arrow-right-circle" style="width: 14px; height: 14px;"></i> Advance Phase → ${nextPhase}
            </button>
          ` : ''}
          ${isPM ? `
            <button class="btn btn-secondary btn-sm" id="btn-edit-proj-meta">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i> Edit Specs
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Project Header Card -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-body" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
            <div style="max-width: 800px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--brand-forest); background: var(--brand-forest-pale); padding: 2px 8px; border-radius: 4px;">
                  ${p.code}
                </span>
                <span class="badge badge-${p.priority.toLowerCase()}">${p.priority} Priority</span>
                <span class="badge badge-completed">${p.status}</span>
              </div>
              <h1 style="font-size: 22px; font-weight: 700; color: var(--brand-charcoal);">${p.name}</h1>
              <p style="font-size: 13.5px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">
                ${p.description || 'No detailed scope description provided.'}
              </p>
            </div>

            <!-- Progress Meter -->
            <div style="min-width: 220px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Overall SDLC Progress</span>
                <span style="color: var(--brand-charcoal); font-weight: 700;">${p.progress_percent}%</span>
              </div>
              <div class="progress-container" style="height: 10px;">
                <div class="progress-fill" style="width: ${p.progress_percent}%;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 10px;">
                <span>PM: <strong>${p.manager_name}</strong></span>
                <span>Team: <strong>${p.members ? p.members.length : 0}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISUAL SDLC PROGRESS TRACKER STEPPER -->
      <div class="sdlc-stepper-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <div>
            <h3 style="font-size: 15px; font-weight: 700; color: var(--brand-charcoal);">SDLC Progression Pipeline</h3>
            <span style="font-size: 12px; color: var(--text-muted);">Current Phase: <strong style="color: var(--brand-forest);">${p.current_phase}</strong></span>
          </div>
          <span style="font-size: 11.5px; color: var(--text-secondary); background: var(--bg-secondary); padding: 4px 10px; border-radius: 12px;">
            Gate Validated Workflow
          </span>
        </div>

        <div class="sdlc-steps-bar">
          ${phases.map((ph, idx) => {
            const isCompleted = ph.status === "Completed";
            const isActive = ph.phase_name === p.current_phase;
            const itemClass = isCompleted ? "completed" : (isActive ? "active" : "");
            return `
              <div class="sdlc-step-item ${itemClass}">
                <div class="sdlc-step-circle">
                  ${isCompleted ? '✓' : (idx + 1)}
                </div>
                <div class="sdlc-step-name">${ph.phase_name}</div>
                <span style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${ph.completion_percent}%</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Project Navigation Tabs -->
      <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px; overflow-x: auto;">
        <button class="btn btn-secondary btn-sm tab-btn ${this.activeTab === 'sdlc-stepper' ? 'btn-primary' : ''}" data-tab="sdlc-stepper">
          <i data-lucide="layers" style="width: 14px; height: 14px;"></i> SDLC Phases Breakdown
        </button>
        <button class="btn btn-secondary btn-sm tab-btn ${this.activeTab === 'design-docs' ? 'btn-primary' : ''}" data-tab="design-docs">
          <i data-lucide="file-code" style="width: 14px; height: 14px;"></i> Design Documentation
        </button>
        <button class="btn btn-secondary btn-sm tab-btn ${this.activeTab === 'team-members' ? 'btn-primary' : ''}" data-tab="team-members">
          <i data-lucide="users" style="width: 14px; height: 14px;"></i> Team (${p.members ? p.members.length : 0})
        </button>
        <button class="btn btn-secondary btn-sm tab-btn ${this.activeTab === 'activity-log' ? 'btn-primary' : ''}" data-tab="activity-log">
          <i data-lucide="history" style="width: 14px; height: 14px;"></i> Activity Timeline
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('requirements', { project_id: ${p.id} })">
          <i data-lucide="external-link" style="width: 13px; height: 13px;"></i> View Requirements
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('tasks', { project_id: ${p.id} })">
          <i data-lucide="external-link" style="width: 13px; height: 13px;"></i> View Kanban Tasks
        </button>
      </div>

      <!-- Tab View Container -->
      <div id="project-tab-content">
        <!-- Rendered based on activeTab -->
      </div>

      <!-- Advance Phase Modal -->
      <div id="modal-advance-phase" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Advance SDLC Phase</h3>
            <button class="modal-close" id="btn-close-adv-modal">&times;</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 13.5px; color: var(--text-secondary);">
              You are moving project <strong>${p.name}</strong> from phase:
            </p>
            <div style="padding: 12px; background: var(--bg-secondary); border-radius: 6px; font-weight: 600; text-align: center; color: var(--brand-charcoal); margin: 8px 0 16px 0;">
              ${p.current_phase} ➔ <span style="color: var(--brand-forest);">${nextPhase || 'N/A'}</span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted); background: #FFF; border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px;">
              <strong>Phase Transition Gate Requirements:</strong>
              <ul style="margin-left: 20px; margin-top: 6px; line-height: 1.5;">
                <li>Previous phase tasks will be verified for completion.</li>
                <li>Critical or High severity defects must be zero for Deployment phase.</li>
                <li>Audit activity will be recorded and all team members notified.</li>
              </ul>
            </div>
            <div id="adv-phase-error" style="color: #DC2626; font-size: 12.5px; margin-top: 10px; display: none;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-adv-modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="btn-confirm-adv-phase">Confirm & Advance Phase</button>
          </div>
        </div>
      </div>

      <!-- Add Team Member Modal -->
      <div id="modal-add-member" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Assign Team Member to Project</h3>
            <button class="modal-close" id="btn-close-add-member">&times;</button>
          </div>
          <form id="form-add-member">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Select User</label>
                <select id="select-team-user" class="form-control" required>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Role in Project</label>
                <input type="text" id="member-project-role" class="form-control" placeholder="e.g. Lead Graphics Engineer, QA Lead" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-add-member">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Member</button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindHubEvents();
    this.renderActiveTabContent();
  },

  bindHubEvents() {
    const p = this.project;

    // Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.getAttribute("data-tab");
        document.querySelectorAll(".tab-btn").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        this.renderActiveTabContent();
      };
    });

    // Advance Phase
    const advBtn = document.getElementById("btn-advance-phase");
    const advModal = document.getElementById("modal-advance-phase");
    const closeAdvBtn = document.getElementById("btn-close-adv-modal");
    const cancelAdvBtn = document.getElementById("btn-cancel-adv-modal");
    const confirmAdvBtn = document.getElementById("btn-confirm-adv-phase");
    const advError = document.getElementById("adv-phase-error");

    if (advBtn && advModal) {
      advBtn.onclick = () => {
        advError.style.display = "none";
        advModal.classList.add("active");
      };
      closeAdvBtn.onclick = () => advModal.classList.remove("active");
      cancelAdvBtn.onclick = () => advModal.classList.remove("active");

      confirmAdvBtn.onclick = async () => {
        advError.style.display = "none";
        const phases = p.phases || [];
        const currentIdx = phases.findIndex(ph => ph.phase_name === p.current_phase);
        const targetPhase = phases[currentIdx + 1].phase_name;

        try {
          const res = await API.phases.advance(p.id, targetPhase);
          API.toast(res.message, "success");
          advModal.classList.remove("active");
          await this.refreshData();
        } catch (err) {
          advError.textContent = err.message;
          advError.style.display = "block";
        }
      };
    }
  },

  renderActiveTabContent() {
    const container = document.getElementById("project-tab-content");
    if (!container) return;

    if (this.activeTab === "sdlc-stepper") {
      this.renderPhasesTab(container);
    } else if (this.activeTab === "design-docs") {
      this.renderDesignDocsTab(container);
    } else if (this.activeTab === "team-members") {
      this.renderTeamTab(container);
    } else if (this.activeTab === "activity-log") {
      this.renderActivityTab(container);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  renderPhasesTab(container) {
    const phases = (this.readiness && this.readiness.phases) ? this.readiness.phases : (this.project.phases || []).map(p => ({
      name: p.phase_name,
      status: p.status,
      pct: p.completion_percent,
      completed_work: p.description || 'Deliverables on schedule',
      pending_work: 'Phase verification in progress'
    }));

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">SDLC Lifecycle Deliverables & Gate Verification</h3>
            <span style="font-size: 12px; color: var(--text-muted);">Dynamic deliverables status tracked directly from approved specifications, tasks, and test results</span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>SDLC Phase</th>
                <th>Phase Status</th>
                <th>Completion Progress</th>
                <th>Completed Work</th>
                <th>Pending Work / Gate Check</th>
              </tr>
            </thead>
            <tbody>
              ${phases.map(ph => {
                const isActive = ph.name === this.project.current_phase;
                const badgeClass = ph.status === "Completed" ? "badge-completed" : (isActive ? "badge-inprogress" : "badge-todo");
                return `
                  <tr style="${isActive ? 'background-color: var(--bg-card-hover); font-weight: 500;' : ''}">
                    <td>
                      <div style="font-weight: 600; color: var(--brand-charcoal); display: flex; align-items: center; gap: 8px;">
                        ${isActive ? '<span style="color: var(--brand-forest-light); font-size: 14px;">▶</span>' : ''}
                        ${ph.name}
                      </div>
                    </td>
                    <td><span class="badge ${badgeClass}">${isActive ? 'In Progress (Active)' : ph.status}</span></td>
                    <td style="width: 140px;">
                      <div style="font-size: 11.5px; font-weight: 700; margin-bottom: 4px;">
                        ${ph.pct}%
                      </div>
                      <div class="progress-container" style="height: 6px;">
                        <div class="progress-fill" style="width: ${ph.pct}%;"></div>
                      </div>
                    </td>
                    <td style="font-size: 13px; color: var(--brand-forest); font-weight: 500;">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10B981;"></i>
                        ${ph.completed_work}
                      </div>
                    </td>
                    <td style="font-size: 12.5px; color: var(--text-secondary);">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="clock" style="width: 14px; height: 14px; color: #D97706;"></i>
                        ${ph.pending_work}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderDesignDocsTab(container) {
    const p = this.project;
    const user = API.getUser() || {};
    const canEdit = user.role === "Project Manager" || user.role === "Developer";

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Software Design Phase Documentation</h3>
            <span style="font-size: 12px; color: var(--text-muted);">Architecture, UI/UX guidelines, database schemas, and technical specs</span>
          </div>
          ${canEdit ? `
            <button class="btn btn-primary btn-sm" id="btn-save-design-docs">
              <i data-lucide="save" style="width: 14px; height: 14px;"></i> Save Documentation
            </button>
          ` : ''}
        </div>
        <div class="card-body" style="display: flex; flex-direction: column; gap: 20px;">
          <div class="form-group">
            <label class="form-label">System Architecture Notes</label>
            <textarea id="doc-arch" class="form-control" style="height: 120px; font-family: var(--font-mono); font-size: 13px;" ${!canEdit ? 'disabled' : ''} placeholder="Describe microservices, network protocols, server topology...">${p.architecture_notes || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">UI / UX Design Guidelines</label>
            <textarea id="doc-uiux" class="form-control" style="height: 100px; font-family: var(--font-mono); font-size: 13px;" ${!canEdit ? 'disabled' : ''} placeholder="Typography, accessibility requirements, user flows, layout principles...">${p.ui_ux_notes || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Database Design & Data Models</label>
            <textarea id="doc-db" class="form-control" style="height: 110px; font-family: var(--font-mono); font-size: 13px;" ${!canEdit ? 'disabled' : ''} placeholder="Entities, schemas, index strategies, transaction guarantees...">${p.db_design_notes || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Technical Design & Performance Specifications</label>
            <textarea id="doc-tech" class="form-control" style="height: 110px; font-family: var(--font-mono); font-size: 13px;" ${!canEdit ? 'disabled' : ''} placeholder="Target throughput, SLA response times, encryption, memory footprint...">${p.tech_design_notes || ''}</textarea>
          </div>
        </div>
      </div>
    `;

    const saveBtn = document.getElementById("btn-save-design-docs");
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const architecture_notes = document.getElementById("doc-arch").value;
        const ui_ux_notes = document.getElementById("doc-uiux").value;
        const db_design_notes = document.getElementById("doc-db").value;
        const tech_design_notes = document.getElementById("doc-tech").value;

        try {
          await API.projects.update(p.id, {
            architecture_notes,
            ui_ux_notes,
            db_design_notes,
            tech_design_notes
          });
          API.toast("Design documentation saved successfully!", "success");
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }
  },

  renderTeamTab(container) {
    const p = this.project;
    const user = API.getUser() || {};
    const isPM = user.role === "Project Manager";
    const members = p.members || [];

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Assigned Engineering & QA Team</h3>
            <span style="font-size: 12px; color: var(--text-muted);">${members.length} active contributors</span>
          </div>
          ${isPM ? `
            <button class="btn btn-primary btn-sm" id="btn-open-add-member">
              <i data-lucide="user-plus" style="width: 14px; height: 14px;"></i> Add Team Member
            </button>
          ` : ''}
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email</th>
                <th>System Role</th>
                <th>Project Assignment Role</th>
                <th>Joined At</th>
                ${isPM ? '<th style="text-align: right;">Action</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${members.map(m => `
                <tr>
                  <td>
                    <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 13.5px;">${m.user_name}</div>
                  </td>
                  <td style="color: var(--text-secondary);">${m.user_email}</td>
                  <td><span class="badge badge-medium">${m.user_role}</span></td>
                  <td><strong>${m.role_in_project}</strong></td>
                  <td style="font-size: 12px; color: var(--text-muted);">${m.joined_at ? m.joined_at.split('T')[0] : 'N/A'}</td>
                  ${isPM ? `
                    <td style="text-align: right;">
                      ${m.user_id !== p.manager_id ? `
                        <button class="btn btn-secondary btn-sm" onclick="ProjectDetailView.removeMember(${m.user_id})">Remove</button>
                      ` : '<span style="font-size: 11px; color: var(--text-muted);">Manager</span>'}
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const addMemberBtn = document.getElementById("btn-open-add-member");
    const modal = document.getElementById("modal-add-member");
    const closeBtn = document.getElementById("btn-close-add-member");
    const cancelBtn = document.getElementById("btn-cancel-add-member");
    const form = document.getElementById("form-add-member");

    if (addMemberBtn && modal) {
      addMemberBtn.onclick = async () => {
        modal.classList.add("active");
        try {
          const allUsers = await API.auth.getUsers();
          const existingIds = members.map(m => m.user_id);
          const select = document.getElementById("select-team-user");
          select.innerHTML = allUsers
            .filter(u => !existingIds.includes(u.id))
            .map(u => `<option value="${u.id}">${u.full_name} (${u.role}) - ${u.email}</option>`)
            .join('');
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
        const user_id = parseInt(document.getElementById("select-team-user").value);
        const role_in_project = document.getElementById("member-project-role").value.trim();

        try {
          await API.projects.addMember(p.id, { user_id, role_in_project });
          API.toast("Member added to project!", "success");
          modal.classList.remove("active");
          form.reset();
          await this.refreshData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }
  },

  async removeMember(userId) {
    if (!confirm("Are you sure you want to remove this member from the project?")) return;
    try {
      await API.projects.removeMember(this.project.id, userId);
      API.toast("Member removed from project.", "info");
      await this.refreshData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async renderActivityTab(container) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted);">Loading activity audit logs...</div>`;

    try {
      const logs = await API.projects.getActivity(this.project.id);
      if (!logs || logs.length === 0) {
        container.innerHTML = `<div class="card" style="padding: 32px; text-align: center; color: var(--text-muted);">No activity logs recorded yet.</div>`;
        return;
      }

      container.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Project Activity & Governance Audit Trail</h3>
            <span style="font-size: 11.5px; color: var(--text-muted);">${logs.length} logged actions</span>
          </div>
          <div class="card-body" style="padding: 24px;">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${logs.map(log => `
                <div style="display: flex; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--brand-forest); flex-shrink: 0;">
                    •
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 13.5px; color: var(--brand-charcoal); font-weight: 500;">
                      ${log.description}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                      By <strong>${log.user_name}</strong> · ${log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div style="color: #DC2626; padding: 16px;">Failed to load activity timeline.</div>`;
    }
  },

  async refreshData() {
    try {
      this.project = await API.projects.get(this.project.id);
      try {
        this.readiness = await API.phases.getReadiness(this.project.id);
      } catch (e) {
        this.readiness = null;
      }
      this.renderHub(document.querySelector(".content-area"));
    } catch (err) {
      API.toast(err.message, "error");
    }
  }
};
