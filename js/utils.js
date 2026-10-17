/* ============================================================
   UTILS.JS - Helper functions
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;
  const icon = toast.querySelector('i');
  toastMessage.textContent = message;
  toast.className = 'toast ' + type;
  if (type === 'success') icon.className = 'fas fa-check-circle';
  else if (type === 'error') icon.className = 'fas fa-exclamation-circle';
  else icon.className = 'fas fa-info-circle';
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function getCourseById(id) {
  return DATA.courses.find(c => c.id === id);
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0xff) + amt);
  const B = Math.min(255, (num & 0xff) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function getDaysUntilDue(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr); due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function getStatusInfo(status, daysLeft) {
  if (status === 'graded') return { label: 'Graded', icon: 'fa-check-double', dueText: 'Graded' };
  if (status === 'submitted') return { label: 'Submitted', icon: 'fa-paper-plane', dueText: 'Submitted' };
  if (status === 'overdue') return { label: 'Overdue', icon: 'fa-exclamation-triangle', dueText: `Overdue by ${Math.abs(daysLeft)} days` };
  if (daysLeft < 0) return { label: 'Overdue', icon: 'fa-exclamation-triangle', dueText: `Overdue by ${Math.abs(daysLeft)} days` };
  if (daysLeft === 0) return { label: 'Due Today', icon: 'fa-clock', dueText: 'Due today!' };
  if (daysLeft === 1) return { label: 'Due Tomorrow', icon: 'fa-clock', dueText: 'Due tomorrow' };
  if (daysLeft <= 3) return { label: 'Due Soon', icon: 'fa-clock', dueText: `Due in ${daysLeft} days` };
  return { label: 'Pending', icon: 'fa-hourglass-half', dueText: `Due in ${daysLeft} days` };
}

/* ===== Confirmation Modal ===== */
function showConfirmModal(title, message, onConfirm, confirmText = 'Confirm') {
  const existing = document.getElementById('confirmModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'confirmModal';
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-box">
      <h3><i class="fas fa-exclamation-triangle" style="color:var(--warning);"></i> ${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeConfirmModal()">Cancel</button>
        <button class="btn-confirm" id="confirmModalBtn">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('confirmModalBtn').onclick = () => {
    closeConfirmModal();
    onConfirm();
  };
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.remove();
}

/* ===== Sidebar Toggle ===== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show', isOpen);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}