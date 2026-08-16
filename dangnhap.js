import Auth from './auth.js';

// Nếu đã đăng nhập rồi → chuyển thẳng về trang chủ
Auth.onAuthChange((user) => {
    if (user) {
        window.location.href = 'main.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Lưu ý: Firebase đăng nhập bằng EMAIL, không phải username.
    // Nếu form của bạn vẫn còn ô "username", hãy bỏ nó đi ở bước này
    // (Firebase không cần username để đăng nhập).
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const result = await Auth.login(email, password);
    showAlert(result.message, result.success ? 'success' : 'error');

    if (result.success) {
        setTimeout(() => { window.location.href = 'main.html'; }, 800);
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