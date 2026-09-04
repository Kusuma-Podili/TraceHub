// Top Header Component

const Header = {
  render(container, user, title = "Dashboard") {
    container.innerHTML = `
      <header class="top-header">
        <div style="display: flex; align-items: center; gap: 16px;">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--brand-charcoal);" id="header-page-title">${title}</h2>
        </div>

        <div class="header-search">
          <i data-lucide="search" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input type="text" id="global-search-input" placeholder="Search projects, tasks, bugs, reqs..." />
        </div>

        <div class="header-actions">
          <!-- Notification Bell -->
          <div style="position: relative;">
            <button class="icon-button" id="btn-header-notif" title="Notifications">
              <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
              <span id="header-notif-count" class="notif-badge-count" style="display: none;">0</span>
            </button>

            <!-- Notification Drawer -->
            <div id="header-notif-drawer" class="notification-drawer">
              <div class="notif-header">
                <span style="font-size: 13.5px; font-weight: 700; color: var(--brand-charcoal);">Notifications</span>
                <button id="btn-mark-all-read" style="background: none; border: none; font-size: 11.5px; color: var(--brand-forest-light); cursor: pointer; font-weight: 600;">
                  Mark all read
                </button>
              </div>
              <div class="notif-list" id="header-notif-list">
                <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
                  Loading notifications...
                </div>
              </div>
            </div>
          </div>

          <!-- User Role Pill -->
          <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-subtle);">
            <div style="width: 26px; height: 26px; border-radius: 50%; background-color: ${user.avatar_color || '#1E3A2F'}; color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">
              ${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 12px; font-weight: 600; color: var(--brand-charcoal); line-height: 1.2;">${user.full_name}</span>
              <span style="font-size: 10px; color: var(--text-muted);">${user.role}</span>
            </div>
          </div>
        </div>
      </header>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.bindEvents();
    this.refreshNotifications();
  },

  bindEvents() {
    const notifBtn = document.getElementById("btn-header-notif");
    const drawer = document.getElementById("header-notif-drawer");
    const markAllBtn = document.getElementById("btn-mark-all-read");

    if (notifBtn && drawer) {
      notifBtn.onclick = (e) => {
        e.stopPropagation();
        drawer.classList.toggle("active");
        if (drawer.classList.contains("active")) {
          this.loadNotificationList();
        }
      };

      document.addEventListener("click", (e) => {
        if (!drawer.contains(e.target) && !notifBtn.contains(e.target)) {
          drawer.classList.remove("active");
        }
      });
    }

    if (markAllBtn) {
      markAllBtn.onclick = async () => {
        try {
          await API.notifications.markAllRead();
          this.refreshNotifications();
          this.loadNotificationList();
        } catch (err) {
          console.error(err);
        }
      };
    }

    // Global Search trigger
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
            window.App.handleGlobalSearch(query);
          }
        }
      };
    }
  },

  async refreshNotifications() {
    try {
      const res = await API.notifications.unreadCount();
      const count = res.unread_count || 0;
      const countEl = document.getElementById("header-notif-count");
      const sideBadge = document.getElementById("sidebar-notif-badge");

      if (countEl) {
        if (count > 0) {
          countEl.textContent = count > 99 ? '99+' : count;
          countEl.style.display = "block";
        } else {
          countEl.style.display = "none";
        }
      }

      if (sideBadge) {
        if (count > 0) {
          sideBadge.textContent = count > 99 ? '99+' : count;
          sideBadge.style.display = "inline-block";
        } else {
          sideBadge.style.display = "none";
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  async loadNotificationList() {
    const listEl = document.getElementById("header-notif-list");
    if (!listEl) return;

    try {
      const notifs = await API.notifications.list();
      if (notifs.length === 0) {
        listEl.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
            No notifications right now.
          </div>
        `;
        return;
      }

      listEl.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.is_read ? '' : 'unread'}" data-id="${n.id}" data-link="${n.link || ''}">
          <div class="notif-title">${n.title}</div>
          <div style="color: var(--text-secondary); line-height: 1.3;">${n.message}</div>
          <div class="notif-time">${n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
        </div>
      `).join('');

      listEl.querySelectorAll(".notif-item").forEach(el => {
        el.onclick = async () => {
          const id = el.getAttribute("data-id");
          const link = el.getAttribute("data-link");
          await API.notifications.markRead(id);
          Header.refreshNotifications();
          if (link && link.startsWith("#")) {
            const route = link.substring(1);
            window.App.navigate(route);
          }
        };
      });
    } catch (err) {
      listEl.innerHTML = `<div style="padding: 16px; color: #DC2626; font-size: 12px;">Failed to load notifications.</div>`;
    }
  }
};
