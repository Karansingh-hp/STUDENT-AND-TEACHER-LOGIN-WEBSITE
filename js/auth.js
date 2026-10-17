/* ============================================================
   AUTH.JS - Multi-Student Login & Register (Fixed)
   ============================================================ */

function getCurrentUser() {
  try {
    const user = sessionStorage.getItem('currentUser');
    const role = sessionStorage.getItem('currentRole');
    if (!user || !role) return null;
    return { user: JSON.parse(user), role };
  } catch (e) { return null; }
}

function setCurrentUser(user, role) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  sessionStorage.setItem('currentRole', role);
}

function clearCurrentUser() {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentRole');
}

function requireAuth(role = null) {
  const session = getCurrentUser();
  if (!session) { window.location.href = 'index.html'; return null; }
  if (role && session.role !== role) {
    window.location.href = session.role === 'teacher' ? 'teacher-dashboard.html' : 'dashboard.html';
    return null;
  }
  return session;
}

function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

/* ===== STUDENT LOGIN ===== */
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const toggle = document.getElementById('togglePassword');
  const pwd = document.getElementById('password');
  const eye = document.getElementById('eyeIcon');
  if (toggle) toggle.addEventListener('click', () => {
    const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd.setAttribute('type', type);
    eye.classList.toggle('fa-eye'); eye.classList.toggle('fa-eye-slash');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('studentId').value.trim();
    const pw = document.getElementById('password').value.trim();
    if (!id || !pw) { showToast('Please fill in all fields.', 'error'); return; }

    let allStudents = Storage.load('westfield_all_students', DATA.allStudents || []);
    if (allStudents.length === 0) {
      allStudents = DATA.allStudents;
      Storage.save('westfield_all_students', allStudents);
    }

    const student = allStudents.find(s => 
      s.id.toLowerCase() === id.toLowerCase() || 
      s.email.toLowerCase() === id.toLowerCase()
    );

    const btn = document.getElementById('loginBtn');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      if (student) {
        setCurrentUser(student, 'student');
        showToast(`Welcome, ${student.firstName}!`, 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 500);
      } else {
        btn.innerHTML = origText;
        btn.disabled = false;
        showToast('❌ Invalid Student ID! Please register first.', 'error');
      }
    }, 800);
  });
}

/* ===== TEACHER LOGIN ===== */
function initTeacherLoginPage() {
  const form = document.getElementById('teacherLoginForm');
  if (!form) return;

  const toggle = document.getElementById('toggleTeacherPassword');
  const pwd = document.getElementById('teacherPassword');
  const eye = document.getElementById('teacherEyeIcon');
  if (toggle) toggle.addEventListener('click', () => {
    const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd.setAttribute('type', type);
    eye.classList.toggle('fa-eye'); eye.classList.toggle('fa-eye-slash');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('teacherId').value.trim();
    const pw = document.getElementById('teacherPassword').value.trim();
    if (!id || !pw) { showToast('Please fill in all fields.', 'error'); return; }

    const btn = document.getElementById('teacherLoginBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      const teacher = { ...DATA.teacher };
      setCurrentUser(teacher, 'teacher');
      showToast(`Welcome, Prof. ${teacher.lastName}!`, 'success');
      setTimeout(() => window.location.href = 'teacher-dashboard.html', 500);
    }, 800);
  });
}

/* ===== STUDENT REGISTER ===== */
function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  let step = 1;
  const savedData = {};

  const updateSteps = () => {
    document.querySelectorAll('.reg-step').forEach((el, i) => {
      el.classList.toggle('active', i < step);
    });
    const s1 = document.getElementById('step1Fields');
    const s2 = document.getElementById('step2Fields');
    const b1 = document.getElementById('step1Buttons');
    const b2 = document.getElementById('step2Buttons');
    const ind = document.getElementById('stepIndicator');
    
    if (s1) s1.style.display = step === 1 ? 'block' : 'none';
    if (s2) s2.style.display = step === 2 ? 'block' : 'none';
    if (b1) b1.style.display = step === 1 ? 'block' : 'none';
    if (b2) b2.style.display = step === 2 ? 'block' : 'none';
    if (ind) ind.textContent = `Step ${step} of 2 — Let's get you started`;
  };

  // 🔥 Global functions banayein taaki onclick kaam kare
  window.goNextStep = () => {
    const fields = ['regFirstName', 'regLastName', 'regEmail', 'regStudentId'];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      const val = el ? el.value.trim() : '';
      savedData[id] = val;
      if (!val) valid = false;
    });
    if (!valid) { showToast('Please fill all fields.', 'error'); return; }
    if (!savedData.regEmail.includes('@')) { showToast('Enter valid email.', 'error'); return; }
    
    let allStudents = Storage.load('westfield_all_students', DATA.allStudents || []);
    if (allStudents.find(s => s.id.toLowerCase() === savedData.regStudentId.toLowerCase())) {
      showToast('Student ID already exists!', 'error');
      return;
    }

    step = 2;
    updateSteps();
  };

  window.goPrevStep = () => { step = 1; updateSteps(); };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwEl = document.getElementById('regPassword');
    const cpwEl = document.getElementById('regConfirmPassword');
    const pw = pwEl ? pwEl.value : '';
    const cpw = cpwEl ? cpwEl.value : '';
    
    if (pw !== cpw) { showToast('Passwords do not match.', 'error'); return; }
    if (pw.length < 6) { showToast('Password too short.', 'error'); return; }
    
    const btn = document.getElementById('registerBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    btn.disabled = true;
    
    setTimeout(() => {
      const dobField = document.getElementById('regDob');
      const dobValue = dobField ? dobField.value : '1 January 2005';
      const phoneField = document.getElementById('regPhone');
      const phoneValue = phoneField ? phoneField.value : '+1 (555) 000-0000';
      const progField = document.getElementById('regProgram');
      const progValue = progField ? progField.value : 'B.Tech Computer Science';
      const yrField = document.getElementById('regYear');
      const yrValue = yrField ? yrField.value : '1st Year';

      const newStudent = {
        id: savedData.regStudentId,
        firstName: savedData.regFirstName,
        lastName: savedData.regLastName,
        email: savedData.regEmail,
        phone: phoneValue,
        dob: dobValue,
        address: 'Not provided',
        program: progValue,
        year: yrValue,
        advisor: 'Prof. R. Mehta',
        gpa: 0.0, 
        attendance: 100, 
        credits: 0,
        initials: (savedData.regFirstName[0] + savedData.regLastName[0]).toUpperCase(),
        enrollmentDate: 'Jan 2025', 
        expectedGraduation: 'May 2029'
      };
      
      let allStudents = Storage.load('westfield_all_students', DATA.allStudents || []);
      allStudents.push(newStudent);
      Storage.save('westfield_all_students', allStudents);

      setCurrentUser(newStudent, 'student');
      showToast(`Account created! Welcome, ${newStudent.firstName}!`, 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    }, 900);
  });

  updateSteps();
}