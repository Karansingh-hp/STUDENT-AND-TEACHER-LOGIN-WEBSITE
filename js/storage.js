/* ============================================================
   STORAGE.JS - localStorage management
   ============================================================ */

const STORAGE_KEYS = {
  SHARED_ASSIGNMENTS: 'westfield_shared_assignments',
  SHARED_SUBMISSIONS: 'westfield_shared_submissions',
  SHARED_GRADES: 'westfield_shared_grades',
  TEACHER_ASSIGNMENTS: 'westfield_teacher_assignments',
  TEACHER_COURSES: 'westfield_teacher_courses',
  TEACHER_MATERIALS: 'westfield_teacher_materials',
  TEACHER_ANNOUNCEMENTS: 'westfield_teacher_announcements',
  TEACHER_PROFILE: 'westfield_teacher_profile',
  TEACHER_MESSAGES: 'westfield_teacher_messages',
  TEACHER_ATTENDANCE: 'westfield_teacher_attendance',
  STUDENT_ASSIGNMENTS: 'westfield_student_assignments',
  STUDENT_PROFILE: 'westfield_student_profile',
  SETTINGS: 'westfield_settings'
};

const Storage = {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Save failed:', key, e);
      return false;
    }
  },

  load(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Load failed:', key, e);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  has(key) {
    return localStorage.getItem(key) !== null;
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  },

  getSize() {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) total += val.length;
    });
    return (total / 1024).toFixed(2);
  }
};

const SharedStore = {
    
  /* ----- ASSIGNMENTS ----- */
  getAssignments() {
    return Storage.load(STORAGE_KEYS.SHARED_ASSIGNMENTS, []);
  },

  addAssignment(assignment) {
    const assignments = this.getAssignments();
    if (assignments.find(a => a.id === assignment.id)) return false;
    assignments.unshift(assignment);
    Storage.save(STORAGE_KEYS.SHARED_ASSIGNMENTS, assignments);
    return true;
  },

  updateAssignment(id, updates) {
    const assignments = this.getAssignments();
    const idx = assignments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    assignments[idx] = { ...assignments[idx], ...updates };
    Storage.save(STORAGE_KEYS.SHARED_ASSIGNMENTS, assignments);
    return true;
  },

  deleteAssignment(id) {
    const assignments = this.getAssignments().filter(a => a.id !== id);
    Storage.save(STORAGE_KEYS.SHARED_ASSIGNMENTS, assignments);
    const submissions = this.getSubmissions().filter(s => s.assignmentId !== id);
    Storage.save(STORAGE_KEYS.SHARED_SUBMISSIONS, submissions);
  },

  getAssignment(id) {
    return this.getAssignments().find(a => a.id === id);
  },

  /* ----- SUBMISSIONS ----- */
  getSubmissions() {
    return Storage.load(STORAGE_KEYS.SHARED_SUBMISSIONS, []);
  },

  addSubmission(submission) {
    const submissions = this.getSubmissions();
    const existingIdx = submissions.findIndex(
      s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
    );
    if (existingIdx !== -1) {
      submissions[existingIdx] = { ...submissions[existingIdx], ...submission };
    } else {
      submissions.push(submission);
    }
    Storage.save(STORAGE_KEYS.SHARED_SUBMISSIONS, submissions);
    return true;
  },

  getSubmissionsForAssignment(assignmentId) {
    return this.getSubmissions().filter(s => s.assignmentId === assignmentId);
  },

  getSubmissionsByStudent(studentId) {
    return this.getSubmissions().filter(s => s.studentId === studentId);
  },

  getSubmission(assignmentId, studentId) {
    return this.getSubmissions().find(
      s => s.assignmentId === assignmentId && s.studentId === studentId
    );
  },

  /* ----- GRADES ----- */
  getGrades() {
    return Storage.load(STORAGE_KEYS.SHARED_GRADES, []);
  },

  saveGrade(grade) {
    const grades = this.getGrades();
    const idx = grades.findIndex(
      g => g.assignmentId === grade.assignmentId && g.studentId === grade.studentId
    );
    if (idx !== -1) grades[idx] = grade;
    else grades.push(grade);
    Storage.save(STORAGE_KEYS.SHARED_GRADES, grades);
  },

  getGradesForStudent(studentId) {
    return this.getGrades().filter(g => g.studentId === studentId);
  }
};
/* ===== MESSAGES STORE (Naya Code) ===== */
const MessageStore = {
  // Messages load karo (with fallback)
  getMessages() {
    let msgs = Storage.load('westfield_shared_messages', null);
    
    // Agar pehle se data.js wale default messages hain toh use karo
    if (!msgs || msgs.length === 0) {
      msgs = DATA.messages || [];
      // Ensure format
      msgs = msgs.map(m => ({
        ...m,
        unread: m.unread || 0
      }));
      Storage.save('westfield_shared_messages', msgs);
    }
    return msgs;
  },

  // Save messages
  saveMessages(msgs) {
    Storage.save('westfield_shared_messages', msgs);
  },

  // Add a message to a conversation
  addMessage(contactIdx, text, sender) {
    let msgs = this.getMessages();
    if (!msgs[contactIdx]) return false;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgs[contactIdx].messages.push({
      text: text,
      sender: sender, // 'sent' or 'received'
      time: now
    });
    
    // Agar received hai, toh unread count badhao
    if (sender === 'received') {
      msgs[contactIdx].unread = (msgs[contactIdx].unread || 0) + 1;
    }
    
    this.saveMessages(msgs);
    return msgs;
  },

  // Mark as read
  markRead(contactIdx) {
    let msgs = this.getMessages();
    if (msgs[contactIdx]) {
      msgs[contactIdx].unread = 0;
      this.saveMessages(msgs);
    }
  },

  // Reset to default
  reset() {
    Storage.save('westfield_shared_messages', DATA.messages || []);
  }
};

/* Initialize storage */
function initStorage() {
  if (!Storage.has(STORAGE_KEYS.SHARED_ASSIGNMENTS)) Storage.save(STORAGE_KEYS.SHARED_ASSIGNMENTS, []);
  if (!Storage.has(STORAGE_KEYS.SHARED_SUBMISSIONS)) Storage.save(STORAGE_KEYS.SHARED_SUBMISSIONS, []);
  if (!Storage.has(STORAGE_KEYS.SHARED_GRADES)) Storage.save(STORAGE_KEYS.SHARED_GRADES, []);
}