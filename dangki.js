import Auth from './auth.js';

// Nếu đã đăng nhập rồi → chuyển thẳng về trang chủ
Auth.onAuthChange((user) => {
    if (user) {
        window.location.href = 'main.html';
    }
});

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const result = await Auth.register(username, email, password);
    showAlert(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        setTimeout(() => { window.location.href = 'dangnhap.html'; }, 1200);
    } else if (submitBtn) {
        submitBtn.disabled = false;
    }
});

function showAlert(msg, type) {
    const el = document.getElementById('alertMsg');
    el.textContent = msg;
    el.className = 'alert-msg ' + (type === 'success' ? 'alert-success' : 'alert-error');
    el.style.display = 'block';
}