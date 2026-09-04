// In-App Notifications Center View

const NotificationsView = {
  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Notification Center & Alerts</h1>
          <p class="page-subtitle">Real-time alerts for task handoffs, phase progressions, defect assignments, and test failures</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-refresh-notifs">
            <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i> Refresh
          </button>
          <button class="btn btn-primary" id="btn-mark-all-read-view">
            <i data-lucide="check-check" style="width: 15px; height: 15px;"></i> Mark All as Read
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding: 0;" id="notif-feed-container">
          <div style="padding: 32px; text-align: center; color: var(--text-muted);">
            Loading notifications...
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
    const refreshBtn = document.getElementById("btn-refresh-notifs");
    if (refreshBtn) refreshBtn.onclick = () => this.loadData();

    const markAllBtn = document.getElementById("btn-mark-all-read-view");
    if (markAllBtn) {
      markAllBtn.onclick = async () => {
        try {
          await API.notifications.markAllRead();
          API.toast("All notifications marked as read.", "info");
          Header.refreshNotifications();
          this.loadData();
        } catch (err) {
          API.toast(err.message, "error");
        }
      };
    }
  },

  async loadData() {
    const container = document.getElementById("notif-feed-container");
    if (!container) return;

    try {
      const notifs = await API.notifications.list();
      if (!notifs || notifs.length === 0) {
        container.innerHTML = `
          <div style="padding: 48px; text-align: center; color: var(--text-muted);">
            <i data-lucide="bell-off" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;"></i>
            <p>You have no notifications at this time.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      container.innerHTML = `
        <div style="display: flex; flex-direction: column;">
          ${notifs.map(n => {
            const isUnread = !n.is_read;
            const borderCol = n.type === 'alert' ? '#DC2626' : (n.type === 'warning' ? '#D97706' : '#10B981');
            return `
              <div style="padding: 16px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; ${isUnread ? 'background:#FAFDFB; border-left: 4px solid ' + borderCol + ';' : ''}">
                <div style="display: flex; gap: 14px; align-items: flex-start;">
                  <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--brand-forest); flex-shrink: 0; font-size: 14px;">
                    ${n.type === 'alert' ? '⚠' : (n.type === 'warning' ? '⚡' : '✓')}
                  </div>
                  <div>
                    <div style="font-weight: 600; color: var(--brand-charcoal); font-size: 14px;">${n.title}</div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
                      ${n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  ${n.link ? `
                    <button class="btn btn-secondary btn-sm" onclick="NotificationsView.navigateLink('${n.link}', ${n.id})">
                      View
                    </button>
                  ` : ''}
                  ${isUnread ? `
                    <button class="btn btn-secondary btn-sm" onclick="NotificationsView.markSingleRead(${n.id})">
                      Mark Read
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div style="padding: 24px; color: #DC2626;">Error: ${err.message}</div>`;
    }
  },

  async markSingleRead(id) {
    try {
      await API.notifications.markRead(id);
      Header.refreshNotifications();
      this.loadData();
    } catch (err) {
      API.toast(err.message, "error");
    }
  },

  async navigateLink(link, id) {
    await this.markSingleRead(id);
    if (link && link.startsWith("#")) {
      window.App.navigate(link.substring(1));
    }
  }
};
