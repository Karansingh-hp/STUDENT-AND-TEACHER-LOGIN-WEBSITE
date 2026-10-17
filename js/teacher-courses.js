/* ============================================================
   TEACHER-COURSES.JS - Teacher courses & content management
   ============================================================ */

let activeTeacherCourseTab = 'overview';
let currentTeacherCourseId = 'cs201';

function initTeacherCoursesPage() {
  // 🔥 AUTO-FIX LOGIC
  // Purana adhoora data check karo. Agar usme Data Structures (cs201) ke modules/resources nahi hain,
  // toh purana data delete karke naya complete data load karo.
  
  let savedCourses = Storage.load(STORAGE_KEYS.TEACHER_COURSES, null);
  let needsReset = false;

  if (savedCourses && savedCourses.length > 0) {
    const cs201 = savedCourses.find(c => c.id === 'cs201');
    // Agar cs201 hai par usme resources ya modules nahi hain, matlab ye purana data hai
    if (cs201 && (!cs201.resources || cs201.resources.length === 0 || !cs201.modules || cs201.modules.length === 0)) {
      needsReset = true;
    }
  }

  if (needsReset || !savedCourses || savedCourses.length === 0) {
    console.log("🔄 Resetting course data with new complete data...");
    DATA.teacherCourses = DATA.teacherCourses || [];
    
    // Agar DATA.teacherCourses khali hai, toh default (data.js) se utha lo
    if (DATA.teacherCourses.length === 0) {
      // Fallback if data.js is not loaded properly
      DATA.teacherCourses = [
        { id: 'cs201', code: 'CS 201', title: 'Data Structures & Algorithms', color: '#1e5fa8', icon: 'fa-code', description: 'Master arrays, trees, graphs.', modules: [{ id: 'm1', title: 'Foundations', description: 'Intro', lessons: [] }], resources: [{ name: 'Syllabus', type: 'pdf', size: '1 MB', icon: 'fa-file-pdf' }], enrolled: 45, capacity: 60, avgProgress: 72, avgAttendance: 91, rating: 4.8, completionRate: 68, credits: 4, semester: 'Spring 2025', enrolledStudents: [] },
        { id: 'cs305', code: 'CS 305', title: 'Database Management', color: '#0d9488', icon: 'fa-database', description: 'SQL and NoSQL.', modules: [], resources: [], enrolled: 40, capacity: 50, avgProgress: 62, avgAttendance: 88, rating: 4.6, completionRate: 55, credits: 4, semester: 'Spring 2025', enrolledStudents: [] }
      ];
    }

    Storage.save(STORAGE_KEYS.TEACHER_COURSES, DATA.teacherCourses);
  } else {
    // Data sahi hai, toh load kar lo
    DATA.teacherCourses = savedCourses;
  }

  renderTeacherCoursesPage();
}

function renderTeacherCoursesPage() {
  const grid = document.getElementById('teacherCoursesGrid');
  if (!grid) return;

  grid.innerHTML = DATA.teacherCourses.map(c => `
    <div class="teacher-course-card" onclick="openTeacherCourseDetail('${c.id}')">
      <div class="tc-banner" style="background:linear-gradient(135deg, ${c.color}, ${lightenColor(c.color, 20)});">
        <i class="fas ${c.icon}"></i>
        <div class="tc-banner-badge">${c.code}</div>
      </div>
      <div class="tc-body">
        <h3>${escapeHtml(c.title)}</h3>
        <p class="tc-desc">${escapeHtml(c.description)}</p>
        <div class="tc-meta-grid">
          <div class="tc-meta-item"><i class="fas fa-users"></i><div><strong>${c.enrolled}/${c.capacity}</strong><span>Enrolled</span></div></div>
          <div class="tc-meta-item"><i class="fas fa-chart-line"></i><div><strong>${c.avgProgress}%</strong><span>Progress</span></div></div>
          <div class="tc-meta-item"><i class="fas fa-calendar-check"></i><div><strong>${c.avgAttendance}%</strong><span>Attendance</span></div></div>
          <div class="tc-meta-item"><i class="fas fa-star"></i><div><strong>${c.rating}/5</strong><span>Rating</span></div></div>
        </div>
        <div class="tc-progress-section">
          <div class="tc-progress-row"><span>Completion</span><strong>${c.completionRate}%</strong></div>
          <div class="progress-bar" style="height:6px;"><div class="progress" style="width:${c.completionRate}%;height:6px;"></div></div>
        </div>
        <div class="tc-footer">
          <span><i class="fas fa-book"></i> ${c.modules?.length || 0} modules</span>
          <span><i class="fas fa-folder-open"></i> ${c.resources?.length || 0} resources</span>
        </div>
        <button class="btn-view-course"><i class="fas fa-eye"></i> Manage Course</button>
      </div>
    </div>
  `).join('');
}

function openTeacherCourseDetail(courseId) {
  window.location.href = 'teacher-course-detail.html?id=' + courseId;
}

function initTeacherCourseDetailPage() {
  const params = new URLSearchParams(window.location.search);
  currentTeacherCourseId = params.get('id') || 'cs201';
  
  // Ensure course data exists in DATA
  if (!DATA.teacherCourses || DATA.teacherCourses.length === 0) {
    DATA.teacherCourses = Storage.load(STORAGE_KEYS.TEACHER_COURSES, []);
  }
  
  renderTeacherCourseDetail();
}

function renderTeacherCourseDetail() {
  const c = DATA.teacherCourses.find(x => x.id === currentTeacherCourseId);
  if (!c) return;

  const heroEl = document.getElementById('tcHero');
  if (heroEl) {
    heroEl.style.background = `linear-gradient(135deg, ${c.color}, ${lightenColor(c.color, 20)})`;
    heroEl.innerHTML = `
      <div class="course-detail-hero-content">
        <div class="course-detail-badge"><i class="fas ${c.icon}"></i> ${escapeHtml(c.code)} · ${escapeHtml(c.semester)}</div>
        <h1>${escapeHtml(c.title)}</h1>
        <p>${escapeHtml(c.description)}</p>
        <div class="course-detail-stats">
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-users"></i></div><div class="stat-info"><h4>${c.enrolled}</h4><p>Students</p></div></div>
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-star"></i></div><div class="stat-info"><h4>${c.credits}</h4><p>Credits</p></div></div>
        </div>
      </div>
    `;
  }
  renderTeacherCourseTabContent(c);
}

function setTeacherCourseTab(tab) {
  activeTeacherCourseTab = tab;
  document.querySelectorAll('.course-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const c = DATA.teacherCourses.find(x => x.id === currentTeacherCourseId);
  if (c) renderTeacherCourseTabContent(c);
}

function renderTeacherCourseTabContent(c) {
  const container = document.getElementById('tcTabContent');
  if (!container) return;

  if (activeTeacherCourseTab === 'students') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header"><h3><i class="fas fa-users"></i> Students (${c.enrolledStudents?.length || 0})</h3></div>
        <div class="student-list">
          ${(c.enrolledStudents || []).map(s => `
            <div class="student-row-detailed">
              <div class="student-avatar">${escapeHtml(s.avatar || s.name.substring(0,2))}</div>
              <div class="student-main"><h5>${escapeHtml(s.name)}</h5><p>${escapeHtml(s.email)}</p></div>
              <div class="student-metrics">
                <div class="metric"><span>Grade</span><strong>${escapeHtml(s.grade)}</strong></div>
                <div class="metric"><span>Attendance</span><strong>${s.attendance}%</strong></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTeacherCourseTab === 'modules') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-list-ul"></i> Modules</h3>
          <button class="btn-primary" onclick="addNewModule('${c.id}')"><i class="fas fa-plus"></i> Add Module</button>
        </div>
        ${(!c.modules || c.modules.length === 0) ? '<p>No modules added yet.</p>' : c.modules.map(m => `
          <div class="teacher-module-card">
            <div class="tm-header">
              <div class="tm-icon"><i class="fas fa-folder"></i></div>
              <div class="tm-info"><h4>${escapeHtml(m.title)}</h4><p>${m.lessons?.length || 0} lessons</p></div>
              <div class="tm-actions">
                <button class="btn-icon-action danger" onclick="deleteModule('${c.id}', '${m.id}')"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeTeacherCourseTab === 'materials') {
    // Combine teacher materials and course resources for display
    if (!c.resources) c.resources = [];
    
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-folder-open"></i> Materials & Resources</h3>
          <button class="btn-primary" onclick="addNewResource('${c.id}')"><i class="fas fa-plus"></i> Upload Resource</button>
        </div>
        ${c.resources.length === 0 ? '<p>No resources uploaded yet.</p>' : c.resources.map(r => `
          <div class="material-row">
            <div class="material-icon ${r.type}"><i class="fas ${r.icon || 'fa-file'}"></i></div>
            <div class="material-info"><h4>${escapeHtml(r.name)}</h4><p>${r.type.toUpperCase()} · ${escapeHtml(r.size)}</p></div>
            <div class="material-actions">
              <button class="btn-icon-action danger" onclick="deleteResource('${c.id}', '${r.name}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeTeacherCourseTab === 'announcements') {
    if (!c.announcements) c.announcements = [];
    
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-bullhorn"></i> Announcements</h3>
          <button class="btn-primary" onclick="addNewAnnouncement('${c.id}')"><i class="fas fa-plus"></i> Post Announcement</button>
        </div>
        ${c.announcements.length === 0 ? '<p>No announcements yet.</p>' : c.announcements.map((a, idx) => `
          <div class="teacher-announcement">
            <div class="ta-content"><h4>${escapeHtml(a.title)}</h4><p>${escapeHtml(a.body)}</p><span class="ta-date">${escapeHtml(a.date)}</span></div>
            <div class="ta-actions">
              <button class="btn-icon-action danger" onclick="deleteAnnouncement('${c.id}', ${idx})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/* ===== FUNCTIONS TO ADD/SAVE CONTENT ===== */

function saveCourseData() {
  Storage.save(STORAGE_KEYS.TEACHER_COURSES, DATA.teacherCourses);
  renderTeacherCourseTabContent(DATA.teacherCourses.find(x => x.id === currentTeacherCourseId));
  showToast('Saved successfully!', 'success');
}

function addNewModule(courseId) {
  const title = prompt("Enter Module Title:");
  if (!title) return;
  
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  if (!c.modules) c.modules = [];
  
  c.modules.push({
    id: 'm' + Date.now(),
    title: title,
    description: 'New module added',
    lessons: [] // Empty lessons for now
  });
  
  saveCourseData();
}

function deleteModule(courseId, moduleId) {
  if (!confirm("Delete this module?")) return;
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  c.modules = c.modules.filter(m => m.id !== moduleId);
  saveCourseData();
}

function addNewResource(courseId) {
  const name = prompt("Enter Resource Name (e.g., Chapter 1 Notes.pdf):");
  if (!name) return;
  
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  if (!c.resources) c.resources = [];
  
  let type = 'pdf';
  let icon = 'fa-file-pdf';
  if (name.endsWith('.zip')) { type = 'zip'; icon = 'fa-file-archive'; }
  else if (name.endsWith('.ppt') || name.endsWith('.pptx')) { type = 'slide'; icon = 'fa-file-powerpoint'; }
  else if (name.endsWith('.doc') || name.endsWith('.docx')) { type = 'doc'; icon = 'fa-file-word'; }
  
  c.resources.push({
    name: name,
    type: type,
    icon: icon,
    size: '1.5 MB'
  });
  
  saveCourseData();
}

function deleteResource(courseId, resName) {
  if (!confirm("Delete this resource?")) return;
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  c.resources = c.resources.filter(r => r.name !== resName);
  saveCourseData();
}

function addNewAnnouncement(courseId) {
  const title = prompt("Enter Announcement Title:");
  if (!title) return;
  const body = prompt("Enter Announcement Message:");
  if (!body) return;
  
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  if (!c.announcements) c.announcements = [];
  
  c.announcements.unshift({
    title: title,
    body: body,
    date: 'Just now'
  });
  
  saveCourseData();
}

function deleteAnnouncement(courseId, idx) {
  if (!confirm("Delete this announcement?")) return;
  const c = DATA.teacherCourses.find(x => x.id === courseId);
  c.announcements.splice(idx, 1);
  saveCourseData();
}