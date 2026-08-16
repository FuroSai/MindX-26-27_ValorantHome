// ══════════════════════════════════════════
//   VALORANT NEWS — auth.js
//   Xử lý đăng ký & đăng nhập qua localStorage
// ══════════════════════════════════════════

const Auth = (() => {

  // ── Khóa lưu trữ ──
  const USERS_KEY = 'vn_users';      // object { username: { username, email, password } }
  const SESSION_KEY = 'vn_currentUser'; // string username đang đăng nhập

  // ── Helpers ──

  /** Lấy toàn bộ danh sách user từ localStorage */
  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  /** Lưu lại toàn bộ danh sách user */
  function saveAllUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /** Validate email đơn giản */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Validate password tối thiểu 6 ký tự */
  function isValidPassword(password) {
    return password && password.length >= 6;
  }

  // ── API công khai ──

  /**
   * Đăng ký tài khoản mới
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message: string }}
   */
  function register(username, email, password) {
    username = username.trim();
    email = email.trim().toLowerCase();

    if (!username || !email || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ thông tin.' };
    }
    if (username.length < 3) {
      return { success: false, message: 'Tên người dùng phải có ít nhất 3 ký tự.' };
    }
    if (!isValidEmail(email)) {
      return { success: false, message: 'Email không hợp lệ.' };
    }
    if (!isValidPassword(password)) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }

    const users = getAllUsers();

    // Kiểm tra username đã tồn tại chưa
    if (users[username]) {
      return { success: false, message: 'Tên người dùng đã tồn tại!' };
    }

    // Kiểm tra email đã được dùng chưa
    const emailUsed = Object.values(users).some(u => u.email === email);
    if (emailUsed) {
      return { success: false, message: 'Email này đã được đăng ký!' };
    }

    // Lưu user mới
    users[username] = { username, email, password };
    saveAllUsers(users);

    return { success: true, message: 'Đăng ký thành công!' };
  }

  /**
   * Đăng nhập
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message: string }}
   */
  function login(username, email, password) {
    username = username.trim();
    email = email.trim().toLowerCase();

    if (!username || !email || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ thông tin.' };
    }

    const users = getAllUsers();
    const user = users[username];

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại!' };
    }
    if (user.email !== email) {
      return { success: false, message: 'Email không khớp!' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Sai mật khẩu!' };
    }

    // Lưu phiên đăng nhập
    localStorage.setItem(SESSION_KEY, username);
    return { success: true, message: 'Đăng nhập thành công!' };
  }

  /**
   * Đăng xuất
   */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Lấy username đang đăng nhập (null nếu chưa đăng nhập)
   * @returns {string|null}
   */
  function getCurrentUser() {
    return localStorage.getItem(SESSION_KEY) || null;
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  function isLoggedIn() {
    return !!getCurrentUser();
  }

  return { register, login, logout, getCurrentUser, isLoggedIn };

})();
