/* ============================================================
   TEACHER-ASSIGNMENTS.JS - Teacher assignment logic
   ============================================================ */

let teacherAssignmentFilter = 'all';
let teacherAssignmentSort = 'due-asc';
let teacherAssignmentSearch = '';
let teacherAssignmentCourse = 'all';

function initTeacherAssignmentsPage() {
  DATA.teacherAssignments = Storage.load(STORAGE_KEYS.TEACHER_ASSIGNMENTS, []);
  
  const courseFilter = document.getElementById('tCourseFilter');
  if (courseFilter) {
    courseFilter.addEventListener('change', e => {
      teacherAssignmentCourse = e.target.value;
      renderTeacherAssignmentsList();
    });
  }
  updateTeacherAssignmentStats();
  renderTeacherAssignmentsList();
}

function renderTeacherAssignmentsList() {
  const listEl = document.getElementById('teacherAssignmentsList');
  if (!listEl) return;

  let filtered = [...DATA.teacherAssignments];
  if (teacherAssignmentFilter !== 'all') filtered = filtered.filter(a => a.status === teacherAssignmentFilter);
  if (teacherAssignmentCourse !== 'all') filtered = filtered.filter(a => a.courseId === teacherAssignmentCourse);
  if (teacherAssignmentSearch) {
    filtered = filtered.filter(a => a.title.toLowerCase().includes(teacherAssignmentSearch) || a.course.toLowerCase().includes(teacherAssignmentSearch));
  }

  const countEl = document.getElementById('teacherAssignmentsCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${DATA.teacherAssignments.length}`;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="text-align:center;padding:3rem;"><i class="fas fa-inbox" style="font-size:3rem;color:#c8d4e3;margin-bottom:1rem;"></i><h3>No assignments found</h3><p style="color:var(--text-light);">Create a new assignment to get started.</p></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(a => `
    <div class="teacher-assignment-card">
      <div class="teacher-assignment-body">
        <div class="teacher-assignment-top">
          <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
          <span class="teacher-assign-status status-${a.status}">${a.status}</span>
        </div>
        <h4 class="teacher-assignment-title">${escapeHtml(a.title)}</h4>
        <p class="teacher-assignment-desc">${escapeHtml(a.description)}</p>
        <div class="teacher-assignment-footer">
          <span><i class="far fa-calendar"></i> Due ${escapeHtml(a.due)}</span>
          <div class="taf-actions">
            <button class="btn-secondary" style="padding:0.4rem 0.8rem;font-size:0.75rem;" onclick="openAssignmentSubmissions(${a.id})">
              <i class="fas fa-eye"></i> View Submissions
            </button>
            <button class="btn-icon-action danger" onclick="deleteTeacherAssignment(${a.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ===== TEACHER CREATES ASSIGNMENT ===== */
function openCreateAssignmentModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'assignmentEditorModal';
  modal.innerHTML = `
    <div class="modal-box editor-modal">
      <div class="assignment-detail-header">
        <h3><i class="fas fa-plus-circle"></i> Create Assignment</h3>
        <button class="modal-close-btn" onclick="document.getElementById('assignmentEditorModal').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="editor-form">
        <div class="input-group"><label>Title *</label><div class="input-field"><i class="fas fa-heading"></i><input type="text" id="editTitle" placeholder="e.g., Data Structures Project"></div></div>
        <div class="input-row">
          <div class="input-group"><label>Course</label><div class="input-field"><i class="fas fa-book"></i>
            <select id="editCourse"><option value="cs201">CS 201 - Data Structures</option><option value="cs305">CS 305 - Database</option></select>
          </div></div>
          <div class="input-group"><label>Points</label><div class="input-field"><i class="fas fa-star"></i><input type="number" id="editPoints" value="100"></div></div>
        </div>
        <div class="input-group"><label>Description *</label>
          <textarea id="editDesc" rows="3" style="width:100%;padding:0.8rem;border:1.5px solid var(--border);border-radius:12px;" placeholder="Write assignment details here..."></textarea>
        </div>
        <div class="input-group"><label>Due Date *</label><div class="input-field"><i class="fas fa-calendar"></i><input type="date" id="editDue"></div></div>
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="document.getElementById('assignmentEditorModal').remove()">Cancel</button>
        <button class="btn-confirm" style="background:var(--accent);" onclick="saveTeacherAssignment()"><i class="fas fa-save"></i> Create</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveTeacherAssignment() {
  const title = document.getElementById('editTitle').value.trim();
  const courseId = document.getElementById('editCourse').value;
  const courseName = courseId === 'cs201' ? 'CS 201' : 'CS 305';
  const desc = document.getElementById('editDesc').value.trim();
  const dueDate = document.getElementById('editDue').value;
  const points = parseInt(document.getElementById('editPoints').value);

  if (!title || !desc || !dueDate) { showToast('Fill all required fields.', 'error'); return; }

  const dueFormatted = new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const newAssignment = {
    id: Date.now(), // Unique ID
    title: title, 
    course: courseName, 
    courseId: courseId, 
    description: desc,
    dueDate: dueDate, 
    due: dueFormatted, 
    points: points, 
    status: 'open',
    instructor: DATA.teacher.firstName + ' ' + DATA.teacher.lastName
  };

  // 1. Save to Teacher's list
  DATA.teacherAssignments.unshift(newAssignment);
  Storage.save(STORAGE_KEYS.TEACHER_ASSIGNMENTS, DATA.teacherAssignments);

  // 2. 🔥 SHARE WITH STUDENTS! (Push to SharedStore)
  SharedStore.addAssignment(newAssignment);

  document.getElementById('assignmentEditorModal').remove();
  renderTeacherAssignmentsList();
  updateTeacherAssignmentStats();
  showToast('✅ Assignment Published to Students!', 'success');
}

/* ===== TEACHER VIEWS SUBMISSIONS ===== */
function openAssignmentSubmissions(id) {
  const a = DATA.teacherAssignments.find(x => x.id === id);
  if (!a) return;

  // 🔥 Fetch student submissions from SharedStore
  const submissions = SharedStore.getSubmissionsForAssignment(id);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'submissionsModal';
  modal.innerHTML = `
    <div class="modal-box submissions-modal">
      <div class="assignment-detail-header">
        <div>
          <h3>Submissions</h3>
          <p style="font-size:0.8rem;color:var(--text-light);">${escapeHtml(a.title)} · ${escapeHtml(a.course)}</p>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('submissionsModal').remove()"><i class="fas fa-times"></i></button>
      </div>
      
      <div class="submissions-list">
        ${submissions.length === 0 ? `
          <div style="text-align:center;padding:2rem;color:var(--text-light);">
            <i class="fas fa-inbox" style="font-size:2.5rem;margin-bottom:0.5rem;display:block;color:#c8d4e3;"></i>
            <p>No student has submitted this assignment yet.</p>
          </div>
        ` : submissions.map(s => `
          <div class="submission-row">
            <div class="student-avatar">${escapeHtml(s.studentName.substring(0,2))}</div>
            <div class="submission-row-info">
              <h5>${escapeHtml(s.studentName)}</h5>
              <p><i class="fas fa-file-alt"></i> ${escapeHtml(s.file)} · ${escapeHtml(s.submittedAt)}</p>
            </div>
            <div class="submission-row-actions">
               <button class="btn-grade" onclick="openGradingModal(${a.id}, '${s.studentId}', '${s.studentName}')">
                 <i class="fas fa-check"></i> Grade
               </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

/* ===== TEACHER GRADES ASSIGNMENT ===== */
function openGradingModal(assignmentId, studentId, studentName) {
  const a = DATA.teacherAssignments.find(x => x.id === assignmentId);
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'gradingModal';
  modal.innerHTML = `
    <div class="modal-box grading-modal">
      <h3><i class="fas fa-check-circle"></i> Grade Submission</h3>
      <p style="font-size:0.82rem;color:var(--text-light);margin-bottom:1.2rem;">${escapeHtml(a.title)} · ${escapeHtml(studentName)}</p>
      
      <div class="input-group">
        <label>Score (out of ${a.points})</label>
        <div class="input-field"><i class="fas fa-star"></i><input type="number" id="gradeScore" min="0" max="${a.points}" placeholder="e.g., 85"></div>
      </div>
      
      <div class="input-group">
        <label>Feedback</label>
        <textarea id="gradeFeedback" rows="3" style="width:100%;padding:0.8rem;border:1.5px solid var(--border);border-radius:12px;">Good work!</textarea>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onclick="document.getElementById('gradingModal').remove()">Cancel</button>
        <button class="btn-confirm" style="background:var(--success);" onclick="submitGrade(${assignmentId}, '${studentId}')"><i class="fas fa-check"></i> Save Grade</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function submitGrade(assignmentId, studentId) {
  const score = parseInt(document.getElementById('gradeScore').value);
  const feedback = document.getElementById('gradeFeedback').value;
  const a = DATA.teacherAssignments.find(x => x.id === assignmentId);

  if (isNaN(score) || score < 0 || score > a.points) {
    showToast(`Score must be between 0 and ${a.points}.`, 'error');
    return;
  }

  // 1. Shared Store mein grade save karo (taaki student ko dikhe)
  SharedStore.saveGrade({
    assignmentId: assignmentId,
    studentId: studentId,
    score: score,
    feedback: feedback,
    gradedAt: new Date().toISOString()
  });

  // 2. Agar yahi student logged in hai (for demo purposes), toh uske local DATA mein bhi update kardo
  if (studentId === DATA.student.id) {
    const submission = SharedStore.getSubmission(assignmentId, studentId);
    if (submission) {
      // Yahan hum student ke local assignment array ko sync kar rahe hain
      if (!DATA.assignments) DATA.assignments = [];
      const studentAssignment = DATA.assignments.find(sa => sa.id === assignmentId);
      if (studentAssignment) {
        studentAssignment.status = 'graded';
        studentAssignment.earnedPoints = score;
        studentAssignment.feedback = feedback;
      }
    }
  }

  document.getElementById('gradingModal').remove();
  document.getElementById('submissionsModal').remove();
  showToast(`✅ Grade sent to student!`, 'success');
  
  // Agar teacher page pe hain toh list refresh karo
  if (document.getElementById('teacherAssignmentsList')) {
    renderTeacherAssignmentsList();
  }
}

function deleteTeacherAssignment(id) {
  if (!confirm('Delete this assignment? Students will no longer see it.')) return;
  
  DATA.teacherAssignments = DATA.teacherAssignments.filter(x => x.id !== id);
  Storage.save(STORAGE_KEYS.TEACHER_ASSIGNMENTS, DATA.teacherAssignments);
  
  // Shared store se bhi delete karo
  SharedStore.deleteAssignment(id);
  
  renderTeacherAssignmentsList();
  updateTeacherAssignmentStats();
  showToast('Deleted.', 'success');
}

function updateTeacherAssignmentStats() {
  const all = DATA.teacherAssignments;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('tStatTotal', all.length);
  set('tStatOpen', all.filter(a => a.status === 'open').length);
  
  // Count total submissions across all teacher assignments
  let totalSubs = 0;
  all.forEach(a => {
    totalSubs += SharedStore.getSubmissionsForAssignment(a.id).length;
  });
  set('tStatSubmissions', totalSubs);
}

function filterTeacherAssignments(f) { teacherAssignmentFilter = f; renderTeacherAssignmentsList(); }
function searchTeacherAssignments(q) { teacherAssignmentSearch = q.toLowerCase(); renderTeacherAssignmentsList(); }