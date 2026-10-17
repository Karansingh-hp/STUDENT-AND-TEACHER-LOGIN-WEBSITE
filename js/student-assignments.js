/* ============================================================
   STUDENT-ASSIGNMENTS.JS - Student assignment logic
   ============================================================ */

let currentAssignmentFilter = 'all';
let currentAssignmentSort = 'due-asc';
let currentAssignmentSearch = '';
let currentAssignmentCourse = 'all';

function initAssignmentsPage() {
  // 🔥 LOGIN WALE STUDENT KI ID NIKALO
  const session = getCurrentUser();
  if (!session) return;
  const currentStudentId = session.user.id;

  // 1. Teacher ke diye hue assignments aur apne submissions load karo
  const sharedAssignments = SharedStore.getAssignments();
  const mySubmissions = SharedStore.getSubmissionsByStudent(currentStudentId);
  const myGrades = SharedStore.getGradesForStudent(currentStudentId);

  // 2. Assignments process karo
  DATA.assignments = sharedAssignments.map(sa => {
    const submission = mySubmissions.find(s => s.assignmentId === sa.id);
    const grade = myGrades.find(g => g.assignmentId === sa.id);
    
    let status = 'pending';
    if (grade) status = 'graded';
    else if (submission) status = 'submitted';
    else if (new Date(sa.dueDate) < new Date()) status = 'overdue';

    return {
      id: sa.id, title: sa.title, course: sa.course, courseId: sa.courseId,
      description: sa.description, due: sa.due, dueDate: sa.dueDate,
      assignedDate: sa.assignedDate, status: status, priority: sa.priority || 'medium',
      points: sa.points, earnedPoints: grade ? grade.score : null,
      instructor: sa.instructor, attachments: sa.attachments || [],
      rubric: sa.rubric || [], submissionTypes: ['pdf', 'zip', 'doc'],
      submittedFile: submission ? submission.file : null,
      submittedAt: submission ? submission.submittedAt : null,
      feedback: grade ? grade.feedback : null
    };
  });

  // 3. Course filter populate karo
  const courseFilter = document.getElementById('courseFilter');
  if (courseFilter) {
    const courses = [...new Set(DATA.assignments.map(a => ({ id: a.courseId, code: a.course })))];
    const unique = courses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
    courseFilter.innerHTML = `
      <option value="all">All Courses</option>
      ${unique.map(c => `<option value="${c.id}">${escapeHtml(c.code)}</option>`).join('')}
    `;
    courseFilter.addEventListener('change', e => { currentAssignmentCourse = e.target.value; renderAssignmentsList(); });
  }

  updateAssignmentStats();
  renderAssignmentsList();

  // 4. Auto-refresh (Har 5 second)
  if (window._assignmentsRefresh) clearInterval(window._assignmentsRefresh);
  window._assignmentsRefresh = setInterval(() => {
    const latestCount = SharedStore.getAssignments().length;
    if (latestCount !== sharedAssignments.length) {
      initAssignmentsPage();
      showToast('📥 New assignment received from teacher!', 'info');
    }
  }, 5000);
}

function renderAssignmentsList() {
  const listEl = document.getElementById('assignmentsList');
  const countEl = document.getElementById('assignmentsCount');
  if (!listEl) return;

  let filtered = [...DATA.assignments];
  if (currentAssignmentFilter !== 'all') filtered = filtered.filter(a => a.status === currentAssignmentFilter);
  if (currentAssignmentCourse !== 'all') filtered = filtered.filter(a => a.courseId === currentAssignmentCourse);
  if (currentAssignmentSearch) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(currentAssignmentSearch) ||
      a.course.toLowerCase().includes(currentAssignmentSearch)
    );
  }

  filtered.sort((a, b) => {
    switch (currentAssignmentSort) {
      case 'due-asc': return new Date(a.dueDate) - new Date(b.dueDate);
      case 'due-desc': return new Date(b.dueDate) - new Date(a.dueDate);
      case 'priority': const p = { high: 0, medium: 1, low: 2 }; return p[a.priority] - p[b.priority];
      case 'points-desc': return b.points - a.points;
      default: return 0;
    }
  });

  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${DATA.assignments.length}`;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="text-align:center;padding:3rem;"><i class="fas fa-inbox" style="font-size:3rem;color:#c8d4e3;margin-bottom:1rem;"></i><h3>No assignments found</h3></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(a => renderAssignmentCard(a)).join('');
}

function renderAssignmentCard(a) {
  const daysLeft = getDaysUntilDue(a.dueDate);
  const statusInfo = getStatusInfo(a.status, daysLeft);
  const progressPct = a.earnedPoints != null ? Math.round((a.earnedPoints / a.points) * 100) : 0;

  return `
    <div class="assignment-card" onclick="openAssignmentDetail(${a.id})">
      <div class="assignment-card-left">
        <div class="assignment-card-status ${a.status}"><i class="fas ${statusInfo.icon}"></i></div>
      </div>
      <div class="assignment-card-body">
        <div class="assignment-card-top">
          <div>
            <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
            <span class="priority-tag priority-${a.priority}"><i class="fas fa-flag"></i> ${a.priority}</span>
          </div>
          <span class="assignment-badge ${a.status}">${statusInfo.label}</span>
        </div>
        <h4 class="assignment-card-title">${escapeHtml(a.title)}</h4>
        <p class="assignment-card-desc">${escapeHtml(a.description)}</p>
        <div class="assignment-card-meta">
          <span><i class="fas fa-user"></i> ${escapeHtml(a.instructor || 'Teacher')}</span>
          <span><i class="fas fa-star"></i> ${a.points} pts</span>
          ${a.earnedPoints != null ? `<span style="color:var(--success);font-weight:700;"><i class="fas fa-award"></i> ${a.earnedPoints}/${a.points}</span>` : ''}
        </div>
        <div class="assignment-card-footer">
          <div class="assignment-due ${daysLeft < 0 ? 'overdue' : daysLeft <= 2 ? 'urgent' : ''}">
            <i class="far fa-clock"></i> ${statusInfo.dueText}
          </div>
          ${a.status === 'graded' ? `
            <div class="assignment-grade-mini">
              <div class="grade-bar"><div class="grade-fill" style="width:${progressPct}%;"></div></div>
              <span>${progressPct}%</span>
            </div>
          ` : a.status === 'submitted' ? `
            <span class="submitted-tag"><i class="fas fa-check-circle"></i> Submitted</span>
          ` : `
            <button class="btn-submit-mini" onclick="event.stopPropagation();openSubmissionModal(${a.id})">
              <i class="fas fa-upload"></i> Submit
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function updateAssignmentStats() {
  const all = DATA.assignments;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statPending', all.filter(a => a.status === 'pending').length);
  set('statOverdue', all.filter(a => a.status === 'overdue').length);
  set('statSubmitted', all.filter(a => a.status === 'submitted').length);
  set('statGraded', all.filter(a => a.status === 'graded').length);
}

function filterAssignments(f) { currentAssignmentFilter = f; renderAssignmentsList(); }
function sortAssignments(s) { currentAssignmentSort = s; renderAssignmentsList(); }
function searchAssignments(q) { currentAssignmentSearch = q.toLowerCase(); renderAssignmentsList(); }

/* ===== STUDENT SUBMITS ASSIGNMENT ===== */
function openSubmissionModal(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;
  const daysLeft = getDaysUntilDue(a.dueDate);
  const session = getCurrentUser();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'submissionModal';
  modal.innerHTML = `
    <div class="modal-box submission-modal">
      <h3><i class="fas fa-upload"></i> Submit Assignment</h3>
      <p class="submission-modal-subtitle">${escapeHtml(a.title)} · ${escapeHtml(a.course)}</p>
      ${daysLeft < 0 ? `<div class="warning-banner"><i class="fas fa-exclamation-triangle"></i><span>Overdue by ${Math.abs(daysLeft)} days</span></div>` : ''}
      
      <div class="submission-form">
        <label>Upload File</label>
        <div class="file-drop-zone" id="fileDropZone">
          <i class="fas fa-cloud-upload-alt"></i>
          <p><strong>Click to upload</strong> or drag and drop</p>
          <input type="file" id="submissionFile" style="display:none;">
        </div>
        <div id="selectedFileName" class="selected-file" style="display:none;"></div>
        
        <div class="submission-checklist">
          <label><input type="checkbox" id="checkOriginal"> Original work</label>
          <label><input type="checkbox" id="checkCited"> Sources cited</label>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeSubmissionModal()">Cancel</button>
        <button class="btn-confirm" id="submitAssignmentBtn" style="background:var(--accent);"><i class="fas fa-paper-plane"></i> Submit</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const dropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('submissionFile');
  const fileNameEl = document.getElementById('selectedFileName');

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

  function handleFile(file) {
    fileNameEl.style.display = 'flex';
    fileNameEl.innerHTML = `<i class="fas fa-file-alt"></i><span>${escapeHtml(file.name)}</span>`;
    window._selectedFile = file;
  }

  document.getElementById('submitAssignmentBtn').onclick = () => {
    const original = document.getElementById('checkOriginal').checked;
    const cited = document.getElementById('checkCited').checked;

    if (!window._selectedFile) { showToast('Please select a file.', 'error'); return; }
    if (!original || !cited) { showToast('Confirm checklist.', 'error'); return; }

    const btn = document.getElementById('submitAssignmentBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      const now = new Date();
      
      // 🔥 SAVE TO SHARED STORE (Logged-in student ke naam se)
      SharedStore.addSubmission({
        assignmentId: id,
        assignmentTitle: a.title,
        course: a.course,
        studentId: session.user.id,             // 👈 Dynamic ID
        studentName: session.user.firstName + ' ' + session.user.lastName, // 👈 Dynamic Name
        file: window._selectedFile.name,
        submittedAt: now.toLocaleString(),
        status: 'submitted'
      });

      closeSubmissionModal();
      initAssignmentsPage();
      showToast('✅ Submitted! Teacher will see this now.', 'success');
      window._selectedFile = null;
    }, 1000);
  };
}

function closeSubmissionModal() {
  const m = document.getElementById('submissionModal');
  if (m) m.remove();
  window._selectedFile = null;
}

function openAssignmentDetail(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'assignmentDetailModal';
  modal.innerHTML = `
    <div class="modal-box assignment-detail-modal">
      <div class="assignment-detail-header">
        <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
        <button class="modal-close-btn" onclick="document.getElementById('assignmentDetailModal').remove()"><i class="fas fa-times"></i></button>
      </div>
      <h2 class="assignment-detail-title">${escapeHtml(a.title)}</h2>
      <div class="assignment-section">
        <h3>Description</h3>
        <p>${escapeHtml(a.description)}</p>
      </div>
      ${a.status === 'pending' || a.status === 'overdue' ? `
        <button class="btn-primary" style="width:100%;justify-content:center;margin-top:1rem;" onclick="document.getElementById('assignmentDetailModal').remove();openSubmissionModal(${a.id})">
          <i class="fas fa-upload"></i> Submit Assignment
        </button>
      ` : ''}
    </div>
  `;
  document.body.appendChild(modal);
}