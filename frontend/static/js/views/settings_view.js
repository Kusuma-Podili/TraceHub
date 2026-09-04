// Settings & Profile Management View

const SettingsView = {
  async render(container) {
    const user = API.getUser() || {};

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Account & Platform Settings</h1>
          <p class="page-subtitle">Manage user profile credentials, role permissions, and team directory</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: flex-start;">
        <!-- Left: Profile Details -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">User Profile & Identity</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: ${user.avatar_color || '#1E3A2F'}; color: #FFF; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center;">
                ${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 style="font-size: 17px; color: var(--brand-charcoal); font-weight: 700;">${user.full_name}</h3>
                <span class="badge badge-medium" style="margin-top: 4px;">Role: ${user.role}</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                <span style="color: var(--text-muted);">Username</span>
                <strong>${user.username}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                <span style="color: var(--text-muted);">Email Address</span>
                <strong>${user.email}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                <span style="color: var(--text-muted);">Access Token Status</span>
                <span style="color: #10B981; font-weight: 600;">Active Session</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Change Password -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Security & Password</h3>
          </div>
          <form id="form-settings-pwd">
            <div class="card-body">
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label">New Password</label>
                <input type="password" id="settings-new-pwd" class="form-control" placeholder="At least 6 characters" minlength="6" required />
              </div>
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label">Confirm New Password</label>
                <input type="password" id="settings-confirm-pwd" class="form-control" placeholder="Re-type new password" minlength="6" required />
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top: 8px;">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Team Directory Card -->
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <h3 class="card-title">Enterprise Team Directory</h3>
          <span style="font-size: 11.5px; color: var(--text-muted);">All registered platform accounts</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody id="settings-users-tbody">
              <tr>
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">
                  Loading users...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindEvents();
    await this.loadUsers();
  },

  bindEvents() {
    const user = API.getUser() || {};
    const form = document.getElementById("form-settings-pwd");
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const p1 = document.getElementById("settings-new-pwd").value;
        const p2 = document.getElementById("settings-confirm-pwd").value;

        if (p1 !== p2) {
          API.toast("Passwords do not match.", "warning");
          return;
        }

        try {
          await API.auth.forgotPassword({ email: user.email, new_password: p1 });
          API.toast("Password updated successfully!", "success");
          form.reset();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }
  },

  async loadUsers() {
    const tbody = document.getElementById("settings-users-tbody");
    if (!tbody) return;

    try {
      const users = await API.auth.getUsers();
      tbody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: ${u.avatar_color || '#1E3A2F'}; color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">
                ${u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <strong style="font-size: 13.5px; color: var(--brand-charcoal);">${u.full_name}</strong>
            </div>
          </td>
          <td style="font-family: var(--font-mono); font-size: 12.5px;">${u.username}</td>
          <td style="color: var(--text-secondary); font-size: 13px;">${u.email}</td>
          <td><span class="badge badge-medium">${u.role}</span></td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" style="color: #DC2626; padding: 16px;">Failed to load users.</td></tr>`;
    }
  }
};
