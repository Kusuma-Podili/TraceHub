// Auth View Component (Login, Signup, Forgot Password)

const AuthView = {
  render(container) {
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: var(--bg-primary); padding: 24px;">
        <div style="width: 100%; max-width: 440px;">
          <!-- Brand Logo Header -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; background: var(--brand-forest); border-radius: 12px; color: #FFF; font-size: 24px; font-weight: 800; box-shadow: var(--shadow-md); border: 1px solid rgba(255,255,255,0.2);">
              S
            </div>
            <h1 style="font-size: 24px; margin-top: 14px; color: var(--brand-charcoal); font-weight: 700;">SDLC Enterprise</h1>
            <p style="font-size: 13.5px; color: var(--text-secondary); margin-top: 4px;">Software Development Life Cycle Platform</p>
          </div>

          <!-- Auth Card -->
          <div class="card" style="box-shadow: var(--shadow-lg); border-radius: 14px; margin-bottom: 20px;">
            <!-- Tabs -->
            <div style="display: flex; border-bottom: 1px solid var(--border-subtle); background: var(--bg-secondary);">
              <button id="tab-login" style="flex: 1; padding: 14px; font-size: 14px; font-weight: 600; border: none; background: transparent; cursor: pointer; color: var(--brand-charcoal); border-bottom: 2px solid var(--brand-forest);">
                Sign In
              </button>
              <button id="tab-register" style="flex: 1; padding: 14px; font-size: 14px; font-weight: 500; border: none; background: transparent; cursor: pointer; color: var(--text-muted); border-bottom: 2px solid transparent;">
                Create Account
              </button>
            </div>

            <div class="card-body" style="padding: 28px;">
              <!-- Login Form -->
              <form id="form-login">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label">Username or Email</label>
                  <input type="text" id="login-identifier" class="form-control" placeholder="pm@enterprise.com or manager" required />
                </div>
                <div class="form-group" style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label class="form-label">Password</label>
                    <a href="javascript:void(0)" id="link-forgot-pwd" style="font-size: 12px; color: var(--brand-forest-light); text-decoration: none; font-weight: 500;">Forgot password?</a>
                  </div>
                  <input type="password" id="login-password" class="form-control" placeholder="••••••••" required />
                </div>
                <div id="login-error" style="color: #DC2626; font-size: 12.5px; margin-top: 10px; display: none;"></div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; justify-content: center; padding: 10px;">
                  Sign In to Platform
                </button>
              </form>

              <!-- Register Form -->
              <form id="form-register" style="display: none;">
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Full Name</label>
                  <input type="text" id="reg-fullname" class="form-control" placeholder="e.g. Jordan Hayes" required />
                </div>
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Username</label>
                  <input type="text" id="reg-username" class="form-control" placeholder="jhayes" required />
                </div>
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Work Email</label>
                  <input type="email" id="reg-email" class="form-control" placeholder="jordan@company.com" required />
                </div>
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">System Role</label>
                  <select id="reg-role" class="form-control" required>
                    <option value="Project Manager">Project Manager (Full Governance)</option>
                    <option value="Developer">Developer (Workspaces & Tasks)</option>
                    <option value="Tester">Tester (QA Runner & Bugs)</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom: 8px;">
                  <label class="form-label">Password</label>
                  <input type="password" id="reg-password" class="form-control" placeholder="At least 6 characters" minlength="6" required />
                </div>
                <div id="reg-error" style="color: #DC2626; font-size: 12.5px; margin-top: 10px; display: none;"></div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; justify-content: center; padding: 10px;">
                  Register Account
                </button>
              </form>
            </div>
          </div>

          <!-- Demo Quick Logins (One-Click Testing) -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px; text-align: center;">
            <p style="font-size: 11.5px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 10px;">
              ⚡ Quick Demo Logins
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" id="btn-demo-pm" title="Sarah Chen - PM">
                👔 Project Manager
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-demo-dev" title="Alex Rivera - Dev">
                💻 Developer
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-demo-qa" title="Priya Patel - QA">
                🧪 Tester
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div id="forgot-modal" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Reset Your Password</h3>
            <button class="modal-close" id="forgot-close">&times;</button>
          </div>
          <form id="form-forgot">
            <div class="modal-body">
              <p style="font-size: 13.5px; color: var(--text-secondary);">
                Enter your account email address and specify your new password.
              </p>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="forgot-email" class="form-control" placeholder="pm@enterprise.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" id="forgot-new-pwd" class="form-control" placeholder="At least 6 characters" minlength="6" required />
              </div>
              <div id="forgot-error" style="color: #DC2626; font-size: 12.5px; display: none;"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="forgot-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const loginError = document.getElementById("login-error");
    const regError = document.getElementById("reg-error");

    tabLogin.onclick = () => {
      tabLogin.style.borderBottom = "2px solid var(--brand-forest)";
      tabLogin.style.color = "var(--brand-charcoal)";
      tabLogin.style.fontWeight = "600";
      tabRegister.style.borderBottom = "2px solid transparent";
      tabRegister.style.color = "var(--text-muted)";
      tabRegister.style.fontWeight = "500";
      formLogin.style.display = "block";
      formRegister.style.display = "none";
    };

    tabRegister.onclick = () => {
      tabRegister.style.borderBottom = "2px solid var(--brand-forest)";
      tabRegister.style.color = "var(--brand-charcoal)";
      tabRegister.style.fontWeight = "600";
      tabLogin.style.borderBottom = "2px solid transparent";
      tabLogin.style.color = "var(--text-muted)";
      tabLogin.style.fontWeight = "500";
      formRegister.style.display = "block";
      formLogin.style.display = "none";
    };

    // Form Login Submit
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      loginError.style.display = "none";
      const identifier = document.getElementById("login-identifier").value.trim();
      const password = document.getElementById("login-password").value;

      try {
        const res = await API.auth.login({ username_or_email: identifier, password });
        API.setToken(res.access_token);
        API.setUser(res.user);
        API.toast(`Welcome back, ${res.user.full_name}!`, "success");
        window.App.handleLoginSuccess();
      } catch (err) {
        loginError.textContent = err.message;
        loginError.style.display = "block";
      }
    };

    // Form Register Submit
    formRegister.onsubmit = async (e) => {
      e.preventDefault();
      regError.style.display = "none";
      const full_name = document.getElementById("reg-fullname").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const role = document.getElementById("reg-role").value;
      const password = document.getElementById("reg-password").value;

      try {
        const res = await API.auth.register({ full_name, username, email, role, password });
        API.setToken(res.access_token);
        API.setUser(res.user);
        API.toast(`Account registered as ${res.user.role}!`, "success");
        window.App.handleLoginSuccess();
      } catch (err) {
        regError.textContent = err.message;
        regError.style.display = "block";
      }
    };

    // Demo Logins
    document.getElementById("btn-demo-pm").onclick = () => {
      document.getElementById("login-identifier").value = "pm@enterprise.com";
      document.getElementById("login-password").value = "manager123";
      formLogin.dispatchEvent(new Event("submit"));
    };

    document.getElementById("btn-demo-dev").onclick = () => {
      document.getElementById("login-identifier").value = "dev@enterprise.com";
      document.getElementById("login-password").value = "developer123";
      formLogin.dispatchEvent(new Event("submit"));
    };

    document.getElementById("btn-demo-qa").onclick = () => {
      document.getElementById("login-identifier").value = "tester@enterprise.com";
      document.getElementById("login-password").value = "tester123";
      formLogin.dispatchEvent(new Event("submit"));
    };

    // Forgot Password Modal
    const forgotModal = document.getElementById("forgot-modal");
    const linkForgot = document.getElementById("link-forgot-pwd");
    const forgotClose = document.getElementById("forgot-close");
    const forgotCancel = document.getElementById("forgot-cancel");
    const formForgot = document.getElementById("form-forgot");
    const forgotError = document.getElementById("forgot-error");

    linkForgot.onclick = () => forgotModal.classList.add("active");
    forgotClose.onclick = () => forgotModal.classList.remove("active");
    forgotCancel.onclick = () => forgotModal.classList.remove("active");

    formForgot.onsubmit = async (e) => {
      e.preventDefault();
      forgotError.style.display = "none";
      const email = document.getElementById("forgot-email").value.trim();
      const new_password = document.getElementById("forgot-new-pwd").value;

      try {
        const res = await API.auth.forgotPassword({ email, new_password });
        API.toast(res.message, "success");
        forgotModal.classList.remove("active");
      } catch (err) {
        forgotError.textContent = err.message;
        forgotError.style.display = "block";
      }
    };
  }
};
