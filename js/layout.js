/* ============================================================
   LAYOUT.JS - Sidebar + Topbar rendering
   ============================================================ */

function renderSidebar(activePage) {
  const session = getCurrentUser();
  if (!session) return '';
  const { user, role } = session;
  const isTeacher = role === 'teacher';

  // 🔥 LocalStorage se live messages load karo
  const sharedMessages = Storage.load('westfield_shared_messages', DATA.messages || []);
  const totalUnread = sharedMessages.reduce((s, m) => s + (m.unread || 0), 0);

  const pendingAssignments = DATA.assignments.filter(a => a.status === 'pending' || a.status === 'overdue').length;
  const pendingGrading = (DATA.teacherAssignments || []).reduce((s, a) => s + ((a.total || 0) - (a.submissions || 0)), 0);

  const studentNav = {
    main: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'courses', label: 'Courses', icon: 'fa-book', href: 'courses.html' },
      { id: 'assignments', label: 'Assignments', icon: 'fa-tasks', badge: pendingAssignments, href: 'assignments.html' },
      { id: 'grades', label: 'Grades', icon: 'fa-chart-line', href: 'grades.html' },
      { id: 'timetable', label: 'Timetable', icon: 'fa-calendar-alt', href: 'timetable.html' }
    ],
    resources: [
      { id: 'library', label: 'Library', icon: 'fa-bookmark', href: 'library.html' },
      { id: 'events', label: 'Events', icon: 'fa-calendar-check', href: 'events.html' },
      { id: 'messages', label: 'Messages', icon: 'fa-envelope', badge: totalUnread, href: 'messages.html' }
    ],
    account: [
      { id: 'profile', label: 'Profile', icon: 'fa-user', href: 'profile.html' },
      { id: 'settings', label: 'Settings', icon: 'fa-cog', href: 'settings.html' }
    ]
  };

  const teacherNav = {
    main: [
      { id: 'teacher-dashboard', label: 'Dashboard', icon: 'fa-home', href: 'teacher-dashboard.html' },
      { id: 'teacher-courses', label: 'My Courses', icon: 'fa-chalkboard-teacher', href: 'teacher-courses.html' },
      { id: 'teacher-assignments', label: 'Assignments', icon: 'fa-file-signature', badge: pendingGrading > 0 ? Math.min(pendingGrading, 99) : null, href: 'teacher-assignments.html' },
      { id: 'teacher-timetable', label: 'Timetable', icon: 'fa-calendar-alt', href: 'teacher-timetable.html' },
      { id: 'teacher-students', label: 'Students', icon: 'fa-users', href: 'teacher-students.html' },
      { id: 'teacher-attendance', label: 'Attendance', icon: 'fa-user-check', href: 'teacher-attendance.html' },
      { id: 'teacher-library', label: 'Library', icon: 'fa-bookmark', href: 'teacher-library.html' },
      { id: 'teacher-events', label: 'Events', icon: 'fa-calendar-check', href: 'teacher-events.html' }
    ],
    resources: [
      { id: 'teacher-messages', label: 'Messages', icon: 'fa-envelope', badge: totalUnread, href: 'teacher-messages.html' }
    ],
    account: [
      { id: 'teacher-profile', label: 'Profile', icon: 'fa-user', href: 'teacher-profile.html' }
    ]
  };

  const nav = isTeacher ? teacherNav : studentNav;

  const isActive = (id) => {
    if (id === 'courses' && (activePage === 'courses' || activePage === 'course-detail')) return true;
    if (id === 'teacher-courses' && (activePage === 'teacher-courses' || activePage === 'teacher-course-detail')) return true;
    return activePage === id;
  };

  const renderItems = (items) => items.map(item => `
    <li>
      <a href="${item.href}" class="${isActive(item.id) ? 'active' : ''}">
        <i class="fas ${item.icon}"></i>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </a>
    </li>
  `).join('');

  return `
    <aside class="sidebar ${isTeacher ? 'teacher-sidebar' : ''}" id="sidebar">
      <a href="${isTeacher ? 'teacher-dashboard.html' : 'dashboard.html'}" class="sidebar-header">
        <i class="fas fa-graduation-cap"></i>
        <div>
          <h1>${escapeHtml(DATA.institute.name)}</h1>
          <span>${isTeacher ? 'Faculty Portal' : escapeHtml(DATA.institute.tagline)}</span>
        </div>
      </a>
      <div class="sidebar-user">
        <div class="avatar ${isTeacher ? 'teacher-avatar' : ''}">${escapeHtml(user.initials)}</div>
        <div class="user-details">
          <h4>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</h4>
          <p>${isTeacher ? 'Faculty' : escapeHtml(user.id)}</p>
        </div>
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-nav-label">Main</li>
        ${renderItems(nav.main)}
        <li class="sidebar-nav-label">Resources</li>
        ${renderItems(nav.resources)}
        <li class="sidebar-nav-label">Account</li>
        ${renderItems(nav.account)}
      </ul>
      <div class="sidebar-footer">
        <button onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;
}

function renderTopbar() {
  const session = getCurrentUser();
  if (!session) return '';
  const { user, role } = session;
  const isTeacher = role === 'teacher';
  
  const sharedMessages = Storage.load('westfield_shared_messages', DATA.messages || []);
  const unreadMessages = sharedMessages.reduce((sum, m) => sum + (m.unread || 0), 0);

  return `
    <div class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
        <div class="search-global">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search..." onkeydown="if(event.key==='Enter') handleGlobalSearch(this.value)">
        </div>
      </div>
      <div class="topbar-right">
        <a href="${isTeacher ? 'teacher-messages.html' : 'messages.html'}" class="topbar-icon-btn">
          <i class="fas fa-envelope"></i>
          ${unreadMessages > 0 ? '<span class="dot"></span>' : ''}
        </a>
        <a href="${isTeacher ? 'teacher-attendance.html' : 'events.html'}" class="topbar-icon-btn">
          <i class="fas ${isTeacher ? 'fa-clipboard-list' : 'fa-calendar-alt'}"></i>
        </a>
        <button class="topbar-icon-btn" onclick="showToast('Notifications opened.', 'info')">
          <i class="fas fa-bell"></i><span class="dot"></span>
        </button>
        <a href="${isTeacher ? 'teacher-profile.html' : 'profile.html'}" class="topbar-avatar ${isTeacher ? 'teacher-avatar' : ''}">
          ${escapeHtml(user.initials)}
        </a>
      </div>
    </div>
  `;
}

function buildLayout(activePage, mainContent) {
  const session = getCurrentUser();
  if (!session) { window.location.href = 'index.html'; return; }
  const isTeacher = session.role === 'teacher';
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="portal-layout">
      ${renderSidebar(activePage)}
      <main class="main-content">
        ${renderTopbar()}
        <div class="page-content">${mainContent}</div>
        <footer class="portal-footer">
          <p>© ${new Date().getFullYear()} ${escapeHtml(DATA.institute.fullName)}. ${isTeacher ? 'Faculty' : 'Student'} Portal.</p>
        </footer>
      </main>
    </div>
  `;
}

function handleGlobalSearch(query) {
  if (!query.trim()) return;
  const q = query.toLowerCase();
  const session = getCurrentUser();
  const isTeacher = session && session.role === 'teacher';

  if (isTeacher) {
    const c = DATA.teacherCourses?.find(c => c.title?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q));
    if (c) { window.location.href = 'teacher-courses.html'; return; }
  } else {
    const c = DATA.courses.find(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    if (c) { window.location.href = 'course-detail.html?id=' + c.id; return; }
    const a = DATA.assignments.find(a => a.title.toLowerCase().includes(q));
    if (a) { window.location.href = 'assignments.html'; return; }
  }
  showToast('No results for "' + query + '"', 'error');
}