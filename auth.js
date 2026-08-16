// ══════════════════════════════════════════
//   VALORANT NEWS — auth.js (Firebase version)
//   Xử lý đăng ký & đăng nhập qua Firebase Authentication
// ══════════════════════════════════════════

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const Auth = (() => {

  // ── Validate helpers ──
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPassword(password) {
    return password && password.length >= 6;
  }

  function mapFirebaseError(code) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email này đã được đăng ký!';
      case 'auth/invalid-email':
        return 'Email không hợp lệ.';
      case 'auth/weak-password':
        return 'Mật khẩu phải có ít nhất 6 ký tự.';
      case 'auth/user-not-found':
        return 'Tài khoản không tồn tại!';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Sai email hoặc mật khẩu!';
      case 'auth/too-many-requests':
        return 'Bạn đã thử sai quá nhiều lần. Vui lòng thử lại sau.';
      default:
        return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  }

  // ── API công khai (đều là async, khác bản localStorage cũ) ──

  /**
   * Đăng ký tài khoản mới
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async function register(username, email, password) {
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

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Lưu username vào displayName để dùng lại sau này
      await updateProfile(cred.user, { displayName: username });

      // Lưu thêm thông tin user vào Firestore, doc id = uid của Auth
      // (Auth chỉ lưu được email/password, không query được — Firestore
      // mới là nơi lưu profile, và sau này có thể mở rộng thêm field)
      await setDoc(doc(db, 'users', cred.user.uid), {
        username,
        email,
        createdAt: serverTimestamp()
      });

      // Firebase tự động đăng nhập user vừa tạo — đăng xuất ngay
      // để giữ đúng luồng cũ: đăng ký xong phải tự đăng nhập lại.
      await signOut(auth);
      return { success: true, message: 'Đăng ký thành công!' };
    } catch (err) {
      return { success: false, message: mapFirebaseError(err.code) };
    }
  }

  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async function login(email, password) {
    email = email.trim().toLowerCase();

    if (!email || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ thông tin.' };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (err) {
      return { success: false, message: mapFirebaseError(err.code) };
    }
  }

  /**
   * Đăng xuất
   */
  async function logout() {
    await signOut(auth);
  }

  /**
   * Lấy user đang đăng nhập (null nếu chưa đăng nhập)
   * Lưu ý: Firebase load trạng thái auth bất đồng bộ lúc khởi động,
   * nên dùng onAuthChange() để lắng nghe thay vì gọi hàm này ngay lập tức.
   * @returns {object|null}
   */
  function getCurrentUser() {
    return auth.currentUser
      ? { username: auth.currentUser.displayName, email: auth.currentUser.email }
      : null;
  }

  /**
   * Kiểm tra đã đăng nhập chưa (đồng bộ, dùng sau khi onAuthChange đã fire lần đầu)
   * @returns {boolean}
   */
  function isLoggedIn() {
    return !!auth.currentUser;
  }

  /**
   * Lắng nghe thay đổi trạng thái đăng nhập
   * @param {(user: {username: string, email: string}|null) => void} callback
   */
  function onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
      callback(user ? { username: user.displayName, email: user.email } : null);
    });
  }

  return { register, login, logout, getCurrentUser, isLoggedIn, onAuthChange };

})();

export default Auth;