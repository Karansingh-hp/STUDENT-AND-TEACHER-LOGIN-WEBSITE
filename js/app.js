/* ============================================================
   APP.JS - Main entry point
   ============================================================ */

/* ===== Initialize all data ===== */
function initApp() {
  initStorage();

  // Load teacher data
  DATA.teacherAssignments = Storage.load(STORAGE_KEYS.TEACHER_ASSIGNMENTS, []);
  DATA.teacherCourses = Storage.load(STORAGE_KEYS.TEACHER_COURSES, []);
  DATA.teacherMaterials = Storage.load(STORAGE_KEYS.TEACHER_MATERIALS, DATA.teacherMaterials);
  DATA.teacherAnnouncements = Storage.load(STORAGE_KEYS.TEACHER_ANNOUNCEMENTS, DATA.teacherAnnouncements);
  DATA.settings = Storage.load(STORAGE_KEYS.SETTINGS, DATA.settings);

  // Load shared assignments for student
  const sharedAssignments = SharedStore.getAssignments();
  if (sharedAssignments.length > 0) {
    DATA.assignments = sharedAssignments.map(sa => ({ ...sa }));
  }

  // Apply settings
  applySettings();

  // Auto-login check
  const session = getCurrentUser();
  if (session) {
    const currentPage = window.location.pathname.split('/').pop();
    const isTeacherPage = currentPage.startsWith('teacher-');
    const isAuthPage = ['index.html', 'register.html', 'teacher-login.html'].includes(currentPage);
    
    if (isAuthPage) {
      window.location.href = session.role === 'teacher' ? 'teacher-dashboard.html' : 'dashboard.html';
    } else if (session.role === 'teacher' && !isTeacherPage) {
      window.location.href = 'teacher-dashboard.html';
    } else if (session.role === 'student' && isTeacherPage) {
      window.location.href = 'dashboard.html';
    }
  } else {
    const currentPage = window.location.pathname.split('/').pop();
    if (!['', 'index.html', 'register.html', 'teacher-login.html'].includes(currentPage)) {
      window.location.href = 'index.html';
    }
  }

  // Handle modals on click outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      if (e.target.id === 'assignmentDetailModal') closeAssignmentDetail();
      if (e.target.id === 'submissionModal') closeSubmissionModal();
      if (e.target.id === 'teacherAssignmentModal') closeTeacherAssignmentDetail();
      if (e.target.id === 'submissionsModal') closeSubmissionsModal();
      if (e.target.id === 'assignmentEditorModal') e.target.remove();
      if (e.target.id === 'gradingModal') e.target.remove();
      if (e.target.id === 'confirmModal') closeConfirmModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAssignmentDetail();
      closeSubmissionModal();
      closeTeacherAssignmentDetail();
      closeSubmissionsModal();
      closeConfirmModal();
      ['assignmentEditorModal', 'gradingModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    }
  });

  console.log('✅ App initialized');
  console.log('📦 Storage:', Storage.getSize(), 'KB');
}

/* ===== Settings helpers (simplified) ===== */
function applySettings() {
  // LocalStorage se settings uthao (taaki har page par apply ho)
  const savedSettings = Storage.load('westfield_settings', DATA.settings);
  if (!savedSettings || !savedSettings.preferences) return;

  // Dark Mode Apply
  if (savedSettings.preferences.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Compact View Apply
  if (savedSettings.preferences.compactView) {
    document.body.classList.add('compact-view');
  } else {
    document.body.classList.remove('compact-view');
  }
}

function toggleSetting(el, category, key) {
  el.classList.toggle('active');
  const value = el.classList.contains('active');
  if (!DATA.settings[category]) DATA.settings[category] = {};
  DATA.settings[category][key] = value;
  Storage.save(STORAGE_KEYS.SETTINGS, DATA.settings);
  applySettings();
  showToast(`${key} ${value ? 'enabled' : 'disabled'}.`, 'success');
}

/* ===== Start app ===== */
document.addEventListener('DOMContentLoaded', initApp);

/* ===== Expose globally ===== */
window.logout = logout;
window.showToast = showToast;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.handleGlobalSearch = handleGlobalSearch;
window.toggleSetting = toggleSetting;
window.requireAuth = requireAuth;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.clearCurrentUser = clearCurrentUser;
window.escapeHtml = escapeHtml;
window.getCourseById = getCourseById;
window.lightenColor = lightenColor;
window.getDaysUntilDue = getDaysUntilDue;
window.getStatusInfo = getStatusInfo;
window.buildLayout = buildLayout;
window.renderSidebar = renderSidebar;
window.renderTopbar = renderTopbar;
window.showConfirmModal = showConfirmModal;
window.closeConfirmModal = closeConfirmModal;
window.initLoginPage = initLoginPage;
window.initTeacherLoginPage = initTeacherLoginPage;
window.initRegisterPage = initRegisterPage;
window.initAssignmentsPage = initAssignmentsPage;
window.renderAssignmentsList = renderAssignmentsList;
window.filterAssignments = filterAssignments;
window.sortAssignments = sortAssignments;
window.searchAssignments = searchAssignments;
window.openAssignmentDetail = openAssignmentDetail;
window.closeAssignmentDetail = closeAssignmentDetail;
window.openSubmissionModal = openSubmissionModal;
window.closeSubmissionModal = closeSubmissionModal;
window.clearSelectedFile = clearSelectedFile;
window.updateAssignmentStats = updateAssignmentStats;
window.initTeacherAssignmentsPage = initTeacherAssignmentsPage;
window.renderTeacherAssignmentsList = renderTeacherAssignmentsList;
window.openTeacherAssignmentDetail = openTeacherAssignmentDetail;
window.closeTeacherAssignmentDetail = closeTeacherAssignmentDetail;
window.openAssignmentSubmissions = openAssignmentSubmissions;
window.closeSubmissionsModal = closeSubmissionsModal;
window.openGradingModal = openGradingModal;
window.submitGrade = submitGrade;
window.editTeacherAssignment = editTeacherAssignment;
window.deleteTeacherAssignment = deleteTeacherAssignment;
window.openCreateAssignmentModal = openCreateAssignmentModal;
window.openAssignmentEditor = openAssignmentEditor;
window.saveTeacherAssignment = saveTeacherAssignment;
window.updateTeacherAssignmentStats = updateTeacherAssignmentStats;
window.filterTeacherAssignments = filterTeacherAssignments;
window.sortTeacherAssignments = sortTeacherAssignments;
window.searchTeacherAssignments = searchTeacherAssignments;
window.initTeacherCoursesPage = initTeacherCoursesPage;
window.renderTeacherCoursesPage = renderTeacherCoursesPage;
window.openTeacherCourseDetail = openTeacherCourseDetail;
window.initTeacherCourseDetailPage = initTeacherCourseDetailPage;
window.renderTeacherCourseDetail = renderTeacherCourseDetail;
window.setTeacherCourseTab = setTeacherCourseTab;
window.renderTeacherCourseTabContent = renderTeacherCourseTabContent;
window.Storage = Storage;
window.SharedStore = SharedStore;
window.STORAGE_KEYS = STORAGE_KEYS;